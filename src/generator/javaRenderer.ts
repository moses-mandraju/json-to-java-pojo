import { CommonClass, CommonType, GeneratorOptions, JavaClass, JavaField } from '../types'

function javaType(type: CommonType, options: GeneratorOptions): string {
  if (type.kind === 'string') return 'String'
  if (type.kind === 'boolean') return options.useWrapperTypes === false ? 'boolean' : 'Boolean'
  if (type.kind === 'integer') return options.integerType === 'Integer' ? (options.useWrapperTypes === false ? 'int' : 'Integer') : (options.useWrapperTypes === false ? 'long' : 'Long')
  if (type.kind === 'double') return options.useWrapperTypes === false ? 'double' : 'Double'
  if (type.kind === 'date') return 'Instant'
  if (type.kind === 'null') return 'Object'
  if (type.kind === 'object') return type.className
  return `List<${javaType(type.element, options)}>`
}

export function commonClassToJavaClass(model: CommonClass, options: GeneratorOptions): JavaClass {
  const fields: JavaField[] = model.fields.map(field => ({
    name: field.name,
    jsonName: field.jsonName,
    type: javaType(field.type, options),
    imports: field.type.kind === 'array' ? ['java.util.List'] : field.type.kind === 'date' ? ['java.time.Instant'] : []
  }))
  return { name: model.name, imports: [], fields, packageName: options.packageName, model }
}

export function renderJavaModel(model: CommonClass, options: GeneratorOptions): string {
  const cls = commonClassToJavaClass(model, options)
  const lines: string[] = []
  const annotationStyle = options.annotationStyle || (options.useJackson ? 'jackson' : 'none')
  const importSet = new Set<string>()
  for (const field of cls.fields) for (const imp of field.imports) importSet.add(imp)
  if (annotationStyle !== 'none' && cls.fields.some(field => field.jsonName !== field.name)) importSet.add(annotationStyle === 'jackson' ? 'com.fasterxml.jackson.annotation.JsonProperty' : 'com.google.gson.annotations.SerializedName')
  if (options.useLombok) importSet.add('lombok.Data')
  if (options.packageName) lines.push(`package ${options.packageName};`, '')
  const imports = [...importSet].sort()
  const javaImports = imports.filter(item => item.startsWith('java.'))
  const thirdPartyImports = imports.filter(item => !item.startsWith('java.'))
  if (javaImports.length) lines.push(...javaImports.map(item => `import ${item};`))
  if (javaImports.length && thirdPartyImports.length) lines.push('')
  if (thirdPartyImports.length) lines.push(...thirdPartyImports.map(item => `import ${item};`))
  if (imports.length) lines.push('')
  if (options.useLombok) lines.push('@Data')
  if (options.useRecords) {
    lines.push(`public record ${cls.name}(`)
    lines.push(cls.fields.map(field => `    ${field.type} ${field.name}`).join(',\n'))
    lines.push(') {}')
    return lines.join('\n')
  }
  lines.push(`public class ${cls.name} {`, '')
  for (const field of cls.fields) {
    if (annotationStyle !== 'none' && field.jsonName !== field.name) lines.push(`    @${annotationStyle === 'jackson' ? 'JsonProperty' : 'SerializedName'}("${field.jsonName}")`)
    lines.push(`    private ${field.type} ${field.name};`, '')
  }
  if (options.generateGettersSetters && !options.useLombok) {
    for (const field of cls.fields) {
      const cap = field.name[0].toUpperCase() + field.name.slice(1)
      lines.push(`    public ${field.type} get${cap}() { return this.${field.name}; }`)
      lines.push(`    public void set${cap}(${field.type} ${field.name}) { this.${field.name} = ${field.name}; }`, '')
    }
  }
  lines.push('}')
  return lines.join('\n')
}