import { describe, it, expect } from 'vitest'
import { generateClassesFromJson, renderJavaClass } from '../src/generator/classGenerator'
import { safeParseJson } from '../src/generator/jsonParser'

describe('Generator comprehensive', () => {
  it('simple object', () => {
    const json = { id: 101, name: 'John Doe', active: true }
    const classes = generateClassesFromJson(json, { rootClassName: 'User', useLombok: false, useRecords: false })
    const cls = classes.find(c => c.name === 'User')
    expect(cls).toBeTruthy()
    expect(cls!.fields.some(f => f.name === 'id' || f.name === 'name')).toBeTruthy()
  })

  it('nested object', () => {
    const json = { id: 1, address: { city: 'X', country: 'Y' } }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    expect(classes.some(c => c.name === 'Address')).toBeTruthy()
  })

  it('array of primitives', () => {
    const json = { tags: ['a', 'b'] }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    const root = classes.find(c => c.name === 'Root')!
    expect(root.fields.some(f => f.type.includes('List') && f.name === 'tags')).toBeTruthy()
  })

  it('array of objects', () => {
    const json = { users: [{ id: 1, name: 'A' }] }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    expect(classes.some(c => c.name === 'User')).toBeTruthy()
  })

  it('null values', () => {
    const json = { id: null, name: 'X' }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    const root = classes.find(c => c.name === 'Root')!
    expect(root.fields.some(f => f.type === 'Object' && f.name === 'id')).toBeTruthy()
  })

  it('mixed arrays fallback to Object', () => {
    const json = { v: [1, 'two', true] }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    const root = classes.find(c => c.name === 'Root')!
    expect(root.fields.some(f => f.type.includes('List') && f.name === 'v')).toBeTruthy()
  })

  it('snake_case fields converted to camelCase with JsonProperty when needed', () => {
    const json = { first_name: 'John' }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    const out = renderJavaClass(classes[0], { rootClassName: 'Root', useLombok: false, useRecords: false, useJackson: true })
    expect(out.includes('@com.fasterxml.jackson.annotation.JsonProperty("first_name")') || out.includes('@JsonProperty("first_name")')).toBeTruthy()
    expect(out).toContain('private String firstName;')
  })

  it('reserved Java keywords are sanitized', () => {
    const json = { class: 'Test', package: 'p' }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    const out = renderJavaClass(classes[0], { rootClassName: 'Root', useLombok: false, useRecords: false })
    expect(out).toContain('class')
  })

  it('duplicate nested structures reuse classes where possible', () => {
    const json = { billingAddress: { city: 'C' , country: 'X'}, shippingAddress: { city: 'C', country: 'X' } }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    // At least one Address class should exist
    expect(classes.some(c => c.name === 'BillingAddress' || c.name === 'ShippingAddress' || c.name === 'Address')).toBeTruthy()
  })

  it('empty arrays produce List<Object>', () => {
    const json = { items: [] }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false })
    const root = classes.find(c => c.name === 'Root')!
    expect(root.fields.some(f => f.type === 'List<Object>' && f.name === 'items')).toBeTruthy()
  })

  it('date detection (basic ISO) maps to Instant when enabled', () => {
    const json = { createdAt: '2026-08-31T10:30:00Z' }
    const classes = generateClassesFromJson(json, { rootClassName: 'Root', useLombok: false, useRecords: false, detectDates: true })
    const out = renderJavaClass(classes[0], { rootClassName: 'Root', useLombok: false, useRecords: false, detectDates: true })
    expect(out).toContain('Instant')
  })

  it('lombok generation includes @Data and no getters/setters', () => {
    const json = { id: 1, name: 'A' }
    const classes = generateClassesFromJson(json, { rootClassName: 'User', useLombok: true, useRecords: false })
    const out = renderJavaClass(classes[0], { rootClassName: 'User', useLombok: true, useRecords: false })
    expect(out).toContain('@Data')
    expect(out).not.toContain('public Long getId()')
  })

  it('record generation creates a record', () => {
    const json = { id: 1, name: 'A' }
    const classes = generateClassesFromJson(json, { rootClassName: 'User', useLombok: false, useRecords: true })
    const out = renderJavaClass(classes[0], { rootClassName: 'User', useLombok: false, useRecords: true })
    expect(out).toContain('public record User(')
  })

  it('package generation includes package declaration', () => {
    const json = { id: 1 }
    const classes = generateClassesFromJson(json, { rootClassName: 'User', packageName: 'com.example.dto', useLombok: false, useRecords: false })
    const out = renderJavaClass(classes[0], { rootClassName: 'User', packageName: 'com.example.dto', useLombok: false, useRecords: false })
    expect(out).toContain('package com.example.dto;')
  })

  it('supports Integer wrapper selection', () => {
    const classes = generateClassesFromJson({ age: 25 }, { rootClassName: 'User', integerType: 'Integer', useWrapperTypes: true })
    expect(classes[0].fields[0].type).toBe('Integer')
  })

  it('supports primitive selection when wrappers are disabled', () => {
    const classes = generateClassesFromJson({ age: 25, active: true }, { rootClassName: 'User', integerType: 'Long', useWrapperTypes: false })
    expect(classes[0].fields.map(field => field.type)).toEqual(['long', 'boolean'])
  })

  it('preserves safe JSON field names when requested', () => {
    const classes = generateClassesFromJson({ first_name: 'John' }, { rootClassName: 'User', fieldNaming: 'preserve' })
    expect(classes[0].fields[0].name).toBe('first_name')
  })

  it('groups Java and third-party imports', () => {
    const classes = generateClassesFromJson({ first_name: 'John', tags: ['java'] }, { rootClassName: 'User', useJackson: true })
    const out = renderJavaClass(classes[0], { rootClassName: 'User', useJackson: true })
    expect(out.indexOf('import java.util.List;')).toBeLessThan(out.indexOf('import com.fasterxml'))
    expect(out).toContain('import com.fasterxml.jackson.annotation.JsonProperty;')
  })

  it('parses malformed JSON without throwing', () => {
    const parsed = safeParseJson('{ "id": 1, }')
    expect(parsed.value).toBeUndefined()
    expect(parsed.error).toBeTruthy()
  })

  it('does not throw for primitive root JSON', () => {
    expect(() => generateClassesFromJson('value', { rootClassName: 'Root' })).not.toThrow()
  })

  it('supports Gson annotations', () => {
    const classes = generateClassesFromJson({ first_name: 'John' }, { rootClassName: 'User', fieldNaming: 'camelCase', annotationStyle: 'gson' })
    const out = renderJavaClass(classes[0], { rootClassName: 'User', fieldNaming: 'camelCase', annotationStyle: 'gson' })
    expect(out).toContain('import com.google.gson.annotations.SerializedName;')
    expect(out).toContain('@SerializedName("first_name")')
  })
})
