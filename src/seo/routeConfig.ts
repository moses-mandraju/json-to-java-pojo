import { TargetLanguage } from '../types'

export type SeoRoute = 'home' | 'java' | 'csharp' | 'typescript'

export interface RouteConfig {
  route: SeoRoute
  path: string
  language: TargetLanguage
  title: string
  description: string
  ogDescription: string
  kicker: string
  heading: string
  intro: string
  formatName: string
  features: string[]
  faqs: { question: string; answer: string }[]
}

const sharedFaqs = [
  {
    question: 'Is my JSON uploaded to a server?',
    answer: 'No. JSON parsing and code generation happen in the browser. The application does not send your JSON payload or generated source code to a server.'
  },
  {
    question: 'Can this tool handle nested JSON objects and arrays?',
    answer: 'Yes. The shared model handles nested objects, arrays of primitives, arrays of objects, null values, empty arrays, and mixed-type arrays.'
  }
]

export const routeConfigs: Record<SeoRoute, RouteConfig> = {
  home: {
    route: 'home',
    path: '/',
    language: 'java',
    title: 'JSON to Code Converter | Java, C# & TypeScript Generator',
    description: 'Convert JSON to clean Java POJOs, C# classes, and TypeScript interfaces. Generate code directly in your browser with no upload required.',
    ogDescription: 'Convert JSON into clean Java, C#, and TypeScript models directly in your browser.',
    kicker: 'JSON TO CODE GUIDE',
    heading: 'Build code models from JSON without the busywork.',
    intro: 'JSON to Code Converter turns API payloads into readable Java, C#, or TypeScript models directly in your browser. Use it when you need a quick DTO, class, or interface starting point during API integration.',
    formatName: 'target-language files',
    features: ['Java POJOs, Records, and Lombok', 'C# classes and models', 'TypeScript interfaces', 'Nested objects and arrays', 'Jackson and Gson annotations for Java', 'Copy or download generated files'],
    faqs: [
      { question: 'What languages can this JSON converter generate?', answer: 'The application generates Java POJOs, C# classes, and TypeScript interfaces from the same JSON input and shared inferred model.' },
      { question: 'How do I convert JSON to code?', answer: 'Paste JSON, choose Java, C#, or TypeScript in the output panel, configure the relevant options, and copy or download the generated files.' },
      ...sharedFaqs
    ]
  },
  java: {
    route: 'java',
    path: '/json-to-java',
    language: 'java',
    title: 'JSON to Java Converter | POJO, DTO & Class Generator',
    description: 'Convert JSON to Java POJO classes, DTOs, Records, and Lombok models with optional Jackson or Gson annotations in your browser.',
    ogDescription: 'Generate Java classes, POJOs, DTOs, Records, and Lombok models from JSON privately in your browser.',
    kicker: 'JAVA MODEL GENERATOR',
    heading: 'Turn JSON payloads into clean Java classes.',
    intro: 'Generate a practical Java starting point from API responses. Choose POJO classes, Java Records, Lombok, naming, type mappings, and Java annotation styles without uploading your JSON.',
    formatName: 'Java files',
    features: ['Java POJO classes and DTOs', 'Java Records', 'Lombok @Data', 'Jackson @JsonProperty and Gson @SerializedName', 'Long or Integer and wrapper mappings', 'ISO date/time detection as Instant'],
    faqs: [
      { question: 'Can I generate Java POJOs from JSON?', answer: 'Yes. Select Java POJO in the output panel to generate Java classes with fields and optional getters and setters.' },
      { question: 'Can I generate Java Records or Lombok classes?', answer: 'Yes. Java-specific advanced options include Java Records and Lombok @Data output.' },
      { question: 'Does the Java generator support Jackson annotations?', answer: 'Yes. Select Jackson annotation style to generate @JsonProperty when a Java field name differs from its JSON property.' },
      ...sharedFaqs
    ]
  },
  csharp: {
    route: 'csharp',
    path: '/json-to-csharp',
    language: 'csharp',
    title: 'JSON to C# Converter | C# Class Generator',
    description: 'Convert JSON to clean C# classes and models with nested objects and collection support directly in your browser.',
    ogDescription: 'Generate clean C# classes and models from JSON for API integration and application development.',
    kicker: 'C# MODEL GENERATOR',
    heading: 'Turn JSON responses into useful C# classes.',
    intro: 'Generate an idiomatic C# class starting point for API responses, nested objects, primitive arrays, and arrays of objects using the shared JSON model.',
    formatName: 'C# files',
    features: ['C# classes and properties', 'Nested C# object types', 'List<T> collection mappings', 'Primitive, nullable, and mixed-array fallbacks', 'Multiple generated .cs files', 'Browser-only JSON processing'],
    faqs: [
      { question: 'Can I convert JSON to C# classes?', answer: 'Yes. Select C# Class in the output panel to generate C# classes with public properties from your JSON structure.' },
      { question: 'Does the C# generator support nested JSON?', answer: 'Yes. Nested JSON objects and arrays of objects become separate C# types, with the root type shown first.' },
      { question: 'Can I generate C# models for JSON arrays?', answer: 'Yes. Primitive arrays map to List<T>, and arrays of objects generate a separate reusable C# class.' },
      ...sharedFaqs
    ]
  },
  typescript: {
    route: 'typescript',
    path: '/json-to-typescript',
    language: 'typescript',
    title: 'JSON to TypeScript Converter | Interface Generator',
    description: 'Convert JSON to clean TypeScript interfaces and types for API responses, nested objects, and arrays directly in your browser.',
    ogDescription: 'Generate TypeScript interfaces from JSON for frontend applications and API integration.',
    kicker: 'TYPESCRIPT TYPE GENERATOR',
    heading: 'Turn JSON API responses into TypeScript interfaces.',
    intro: 'Generate clean TypeScript interfaces for frontend applications and API clients. Nested objects, arrays, primitives, and safe fallbacks are inferred from your JSON locally.',
    formatName: 'TypeScript files',
    features: ['TypeScript interfaces', 'Nested interface types', 'Primitive and object arrays', 'number, string, boolean, and unknown mappings', 'Multiple generated .ts files', 'Browser-only JSON processing'],
    faqs: [
      { question: 'Can I convert JSON to TypeScript interfaces?', answer: 'Yes. Select TypeScript Interface in the output panel to generate TypeScript interfaces from the JSON structure.' },
      { question: 'Does the TypeScript generator support nested objects and arrays?', answer: 'Yes. Nested objects become related interfaces, while primitive and object arrays become TypeScript array types.' },
      { question: 'Is this useful for frontend API integration?', answer: 'Yes. The generated interfaces provide a clean starting point for typing API responses in TypeScript applications.' },
      ...sharedFaqs
    ]
  }
}

export function getRouteConfig(pathname: string): RouteConfig {
  if (pathname === '/json-to-java') return routeConfigs.java
  if (pathname === '/json-to-csharp') return routeConfigs.csharp
  if (pathname === '/json-to-typescript') return routeConfigs.typescript
  return routeConfigs.home
}

export function getPathForLanguage(language: TargetLanguage): string {
  if (language === 'java') return routeConfigs.java.path
  if (language === 'csharp') return routeConfigs.csharp.path
  return routeConfigs.typescript.path
}
