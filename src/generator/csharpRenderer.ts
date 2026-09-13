import { CommonClass, CommonType, CodeFile } from '../types'

function csharpType(type: CommonType): string {
  if (type.kind === 'string') return 'string'
  if (type.kind === 'boolean') return 'bool'
  if (type.kind === 'integer') return 'long'
  if (type.kind === 'double') return 'double'
  if (type.kind === 'date') return 'DateTime'
  if (type.kind === 'null') return 'object'
  if (type.kind === 'object') return type.className
  return `List<${csharpType(type.element)}>`
}

export function renderCSharpModel(model: CommonClass): string {
  const usesList = model.fields.some(field => field.type.kind === 'array')
  const lines: string[] = []
  if (usesList) lines.push('using System.Collections.Generic;', '')
  lines.push(`public class ${model.name}`, '{')
  for (const field of model.fields) lines.push(`    public ${csharpType(field.type)} ${field.name[0].toUpperCase() + field.name.slice(1)} { get; set; }`)
  lines.push('}')
  return lines.join('\n')
}

export function renderCSharpFiles(models: CommonClass[]): CodeFile[] {
  return models.map(model => ({ name: `${model.name}.cs`, content: renderCSharpModel(model) }))
}