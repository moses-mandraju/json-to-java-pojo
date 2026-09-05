export type JsonValue = null | boolean | number | string | JsonObject | JsonArray
export interface JsonObject { [key: string]: JsonValue }
export interface JsonArray extends Array<JsonValue> {}

export interface GeneratorOptions {
  rootClassName: string
  packageName?: string
  useLombok?: boolean
  useRecords?: boolean
  generateGettersSetters?: boolean
  fieldNaming?: 'preserve' | 'camelCase'
  useJackson?: boolean
  annotationStyle?: 'none' | 'jackson' | 'gson'
  useWrapperTypes?: boolean
  integerType?: 'Integer' | 'Long'
  detectDates?: boolean
}

export interface JavaField {
  name: string
  jsonName: string
  type: string
  imports: string[]
  annotations?: string[]
}

export interface JavaClass {
  name: string
  packageName?: string
  imports: string[]
  fields: JavaField[]
  isRecord?: boolean
  useLombok?: boolean
}
