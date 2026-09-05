import { JsonValue, JsonObject, JsonArray } from '../types'

export type InferredType =
  | { kind: 'string' }
  | { kind: 'boolean' }
  | { kind: 'double' }
  | { kind: 'integer' }
  | { kind: 'null' }
  | { kind: 'object'; properties: Record<string, InferredType> }
  | { kind: 'array'; items: InferredType[] }

function inferPrimitive(v: any): InferredType {
  if (v === null) return { kind: 'null' }
  if (typeof v === 'string') return { kind: 'string' }
  if (typeof v === 'boolean') return { kind: 'boolean' }
  if (typeof v === 'number') {
    if (Number.isInteger(v)) return { kind: 'integer' }
    return { kind: 'double' }
  }
  return { kind: 'null' }
}

export function inferType(value: JsonValue): InferredType {
  if (value === null) return { kind: 'null' }
  if (Array.isArray(value)) {
    const items = value.map(v => inferType(v))
    return { kind: 'array', items }
  }
  if (typeof value === 'object') {
    const obj = value as JsonObject
    const properties: Record<string, InferredType> = {}
    for (const k of Object.keys(obj)) properties[k] = inferType(obj[k])
    return { kind: 'object', properties }
  }
  return inferPrimitive(value)
}
