import { CommonClass, CommonType, CodeFile } from '../types'

function typeScriptType(type: CommonType): string {
  if (type.kind === 'string') return 'string'
  if (type.kind === 'boolean') return 'boolean'
  if (type.kind === 'integer' || type.kind === 'double') return 'number'
  if (type.kind === 'date') return 'string'
  if (type.kind === 'null') return 'unknown'
  if (type.kind === 'object') return type.className
  return `${typeScriptType(type.element)}[]`
}

export function renderTypeScriptModel(model: CommonClass): string {
  const lines = [`export interface ${model.name} {`]
  for (const field of model.fields) lines.push(`  ${field.name}: ${typeScriptType(field.type)};`)
  lines.push('}')
  return lines.join('\n')
}

export function renderTypeScriptFiles(models: CommonClass[]): CodeFile[] {
  return models.map(model => ({ name: `${model.name}.ts`, content: renderTypeScriptModel(model) }))
}