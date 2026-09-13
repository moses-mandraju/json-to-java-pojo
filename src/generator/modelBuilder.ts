import { CommonClass, CommonField, CommonType, JsonValue } from '../types'
import { inferType, InferredType } from './typeInference'
import { preserveSafeName, safeJavaIdentifier, toCamelCase, toPascalCase } from './namingUtils'

export interface ModelBuildOptions {
  rootClassName: string
  fieldNaming?: 'preserve' | 'camelCase'
  detectDates?: boolean
}

type ModelInferredType = InferredType | { kind: 'date' }

function toCommonType(type: ModelInferredType, classNameForObject: () => string, visitObject: (value: JsonValue, name: string) => void): CommonType {
  if (type.kind === 'string') return { kind: 'string' }
  if (type.kind === 'boolean') return { kind: 'boolean' }
  if (type.kind === 'integer') return { kind: 'integer' }
  if (type.kind === 'double') return { kind: 'double' }
  if (type.kind === 'date') return { kind: 'date' }
  if (type.kind === 'null') return { kind: 'null' }
  if (type.kind === 'object') {
    const className = classNameForObject()
    return { kind: 'object', className }
  }
  const first = type.items.find(item => item.kind !== 'null')
  if (!first) return { kind: 'array', element: { kind: 'null' } }
  return { kind: 'array', element: toCommonType(first, classNameForObject, visitObject) }
}

export function buildCommonModel(raw: JsonValue, options: ModelBuildOptions): CommonClass[] {
  const classes: CommonClass[] = []
  const rootName = safeJavaIdentifier(options.rootClassName || 'Root', false)
  const fieldName = (name: string) => options.fieldNaming === 'preserve' ? preserveSafeName(name) : toCamelCase(name)

  function visit(value: JsonValue, name: string): void {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return
    const fields: CommonField[] = []
    for (const key of Object.keys(value)) {
      const property = value[key]
      if (property !== null && typeof property === 'object' && !Array.isArray(property)) {
        const childName = toPascalCase(key)
        fields.push({ name: fieldName(key), jsonName: key, type: { kind: 'object', className: childName } })
        visit(property, childName)
        continue
      }
      if (Array.isArray(property)) {
        const first = property.find(item => item !== null)
        if (first && typeof first === 'object' && !Array.isArray(first)) {
          const childName = toPascalCase(key.endsWith('s') ? key.slice(0, -1) : key)
          fields.push({ name: fieldName(key), jsonName: key, type: { kind: 'array', element: { kind: 'object', className: childName } } })
          visit(first, childName)
        } else {
          const inferred = first === undefined ? undefined : inferType(first)
          fields.push({ name: fieldName(key), jsonName: key, type: { kind: 'array', element: inferred ? toCommonType(inferred, () => toPascalCase(key), visit) : { kind: 'null' } } })
        }
        continue
      }
      const inferred = typeof property === 'string' && options.detectDates && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})$/.test(property)
        ? { kind: 'date' as const }
        : inferType(property)
      fields.push({ name: fieldName(key), jsonName: key, type: toCommonType(inferred, () => toPascalCase(key), visit) })
    }
    classes.push({ name, fields })
  }

  visit(raw, rootName)
  return classes.reverse()
}