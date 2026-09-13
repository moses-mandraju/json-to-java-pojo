import { GeneratorOptions, JavaClass, JsonValue } from '../types'
import { buildCommonModel } from './modelBuilder'
import { commonClassToJavaClass, renderJavaModel } from './javaRenderer'

export function generateClassesFromJson(raw: JsonValue, options: GeneratorOptions): JavaClass[] {
  return buildCommonModel(raw, options).map(model => commonClassToJavaClass(model, options))
}

export function renderJavaClass(cls: JavaClass, options: GeneratorOptions): string {
  if (cls.model) return renderJavaModel(cls.model, options)
  return renderJavaModel({
    name: cls.name,
    fields: cls.fields.map(field => ({
      name: field.name,
      jsonName: field.jsonName,
      type: { kind: 'string' }
    }))
  }, options)
}
