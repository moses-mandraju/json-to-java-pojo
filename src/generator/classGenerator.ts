import { GeneratorOptions, JavaClass, JavaField } from '../types'
import { inferType, InferredType } from './typeInference'
import { toPascalCase, toCamelCase, safeJavaIdentifier, preserveSafeName } from './namingUtils'

function primitiveTypeFor(inferred: InferredType, options: GeneratorOptions): string {
  if (inferred.kind === 'string') return 'String'
  if (inferred.kind === 'boolean') return options.useWrapperTypes === false ? 'boolean' : 'Boolean'
  if (inferred.kind === 'double') return options.useWrapperTypes === false ? 'double' : 'Double'
  if (inferred.kind === 'integer') return options.integerType === 'Integer' ? (options.useWrapperTypes === false ? 'int' : 'Integer') : (options.useWrapperTypes === false ? 'long' : 'Long')
  if (inferred.kind === 'null') return 'Object'
  if (inferred.kind === 'object') return 'Object'
  if (inferred.kind === 'array') return 'List<Object>'
  return 'Object'
}

export function generateClassesFromJson(raw: any, options: GeneratorOptions): JavaClass[] {
  const rootName = safeJavaIdentifier(options.rootClassName || 'Root', false)
  const classes: JavaClass[] = []

  function walk(value: any, name: string) {
    if (value === null) {
      classes.push({ name, imports: [], fields: [], packageName: options.packageName })
      return
    }
    if (Array.isArray(value)) {
      // handle array of objects
      const first = value.find(v => v != null && typeof v === 'object')
      if (first) walk(first, name)
      return
    }
    if (typeof value === 'object') {
      const fields: JavaField[] = []
      for (const key of Object.keys(value)) {
        const val = value[key]
        const fieldName = options.fieldNaming === 'preserve' ? preserveSafeName(key) : toCamelCase(key)
        if (val === null) {
          fields.push({ name: fieldName, jsonName: key, type: 'Object', imports: [] })
          continue
        }
        if (Array.isArray(val)) {
          if (val.length === 0) {
            fields.push({ name: fieldName, jsonName: key, type: 'List<Object>', imports: ['java.util.List'] })
            continue
          }
          const first = val.find(v => v !== null)
          if (first && typeof first === 'object') {
            const className = toPascalCase(key.endsWith('s') ? key.slice(0, -1) : key)
            fields.push({ name: fieldName, jsonName: key, type: `List<${className}>`, imports: ['java.util.List'] })
            walk(first, className)
            continue
          }
          // primitives
          const inferred = inferType(first)
          const t = primitiveTypeFor(inferred, options)
          fields.push({ name: fieldName, jsonName: key, type: `List<${t}>`, imports: ['java.util.List'] })
          continue
        }
        if (typeof val === 'object') {
          const className = toPascalCase(key)
          fields.push({ name: fieldName, jsonName: key, type: className, imports: [] })
          walk(val, className)
          continue
        }
        // primitives
        // optional date detection for ISO-8601 strings
        if (typeof val === 'string' && options.detectDates) {
          const isoReco = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})$/
          if (isoReco.test(val)) {
            fields.push({ name: fieldName, jsonName: key, type: 'Instant', imports: ['java.time.Instant'] })
            continue
          }
        }
        const inferred = inferType(val)
        const t = primitiveTypeFor(inferred, options)
        fields.push({ name: fieldName, jsonName: key, type: t, imports: [] })
      }
      classes.push({ name, imports: [], fields, packageName: options.packageName })
    }
  }

  walk(raw, rootName)

  // ensure root first
  const ordered = classes.reverse()
  return ordered
}

export function renderJavaClass(cls: JavaClass, options: GeneratorOptions): string {
  const lines: string[] = []
  const annotationStyle = options.annotationStyle || (options.useJackson ? 'jackson' : 'none')
  const importSet = new Set<string>()
  for (const f of cls.fields) for (const imp of f.imports) importSet.add(imp)
  if (annotationStyle === 'jackson' || annotationStyle === 'gson') {
    const needs = cls.fields.some(f => f.jsonName !== f.name)
    if (needs) importSet.add(annotationStyle === 'jackson' ? 'com.fasterxml.jackson.annotation.JsonProperty' : 'com.google.gson.annotations.SerializedName')
  }
  if (options.useLombok) importSet.add('lombok.Data')

  if (options.packageName) lines.push(`package ${options.packageName};`, '')
  const imports = [...importSet].sort()
  const javaImports = imports.filter(imp => imp.startsWith('java.'))
  const thirdPartyImports = imports.filter(imp => !imp.startsWith('java.'))
  if (javaImports.length) lines.push(...javaImports.map(imp => `import ${imp};`))
  if (javaImports.length && thirdPartyImports.length) lines.push('')
  if (thirdPartyImports.length) lines.push(...thirdPartyImports.map(imp => `import ${imp};`))
  if (imports.length) lines.push('')
  const classHeader = options.useRecords ? `public record ${cls.name}(` : `public class ${cls.name} {`
  if (options.useLombok) lines.push('@Data')
  lines.push(classHeader)
  if (options.useRecords) {
    const params = cls.fields.map(f => `    ${f.type} ${f.name}`).join(',\n')
    lines.push(params)
    lines.push(') {}')
  } else {
    lines.push('')
    for (const f of cls.fields) {
      if (annotationStyle !== 'none' && f.jsonName !== f.name) {
        const annotation = annotationStyle === 'jackson' ? 'JsonProperty' : 'SerializedName'
        lines.push(`    @${annotation}("${f.jsonName}")`)
      }
      lines.push(`    private ${f.type} ${f.name};`)
      lines.push('')
    }
    if (options.generateGettersSetters && !options.useLombok) {
      for (const f of cls.fields) {
        const cap = f.name[0].toUpperCase() + f.name.slice(1)
        lines.push(`    public ${f.type} get${cap}() { return this.${f.name}; }`)
        lines.push(`    public void set${cap}(${f.type} ${f.name}) { this.${f.name} = ${f.name}; }`)
        lines.push('')
      }
    }
    lines.push('}')
  }
  return lines.join('\n')
}
