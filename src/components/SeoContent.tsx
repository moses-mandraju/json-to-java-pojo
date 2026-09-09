import React from 'react'

const faqItems = [
  {
    question: 'What is a POJO in Java?',
    answer: 'A POJO, or Plain Old Java Object, is a regular Java class used to represent data. It typically contains fields and may include constructors, getters, and setters without requiring a framework base class.'
  },
  {
    question: 'How do I convert JSON to Java classes?',
    answer: 'Paste a JSON object into the editor, choose the root class name and any generation options, then review the generated Java source. You can copy the selected class or download one class or all generated classes as a ZIP file.'
  },
  {
    question: 'Can this tool handle nested JSON objects?',
    answer: 'Yes. Nested objects are inferred recursively and generated as separate Java classes. The root class is shown first, and generated nested classes can be selected from the Java output panel.'
  },
  {
    question: 'Can I generate Java classes for JSON arrays?',
    answer: 'Yes. Arrays of primitive values are generated as List fields, arrays of objects generate a reusable object class, and empty or mixed-type arrays use a safe Object fallback.'
  },
  {
    question: 'Can I generate Lombok classes or Java Records?',
    answer: 'Yes. The advanced options include Lombok @Data generation and Java Record generation. Lombok output omits manually generated getters and setters.'
  },
  {
    question: 'Can I add Jackson or Gson annotations?',
    answer: 'Yes. The annotation style can be set to Jackson or Gson. When a Java field name differs from its JSON property, the appropriate property annotation is generated.'
  },
  {
    question: 'Is my JSON uploaded to a server?',
    answer: 'No. JSON parsing and Java generation happen in the browser. The application does not send your JSON payload or generated source code to a server.'
  }
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
}

export default function SeoContent() {
  return (
    <section className="seo-content" aria-labelledby="seo-heading">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="seo-content-inner">
        <header className="seo-lead">
          <p className="intro-kicker">JAVA MODEL GENERATION GUIDE</p>
          <h2 id="seo-heading">Build Java models from JSON without the busywork.</h2>
          <p>JSON to Java POJO Converter turns API payloads into readable Java classes directly in your browser. Use it when you need a quick DTO or model starting point during REST API integration.</p>
        </header>

        <div className="seo-grid">
          <article className="seo-card seo-card-wide">
            <h2>What is a JSON to Java POJO Converter?</h2>
            <p>A JSON to Java POJO converter reads the shape of a JSON payload and maps its properties to Java fields and types. Instead of manually creating repetitive model classes, developers can generate a structured Java representation and then adapt it to their project.</p>
            <p>This tool is client-side: the JSON is parsed locally, and the generated Java source is treated as plain text in the browser.</p>
          </article>

          <article className="seo-card">
            <h2>How to Convert JSON to Java POJOs</h2>
            <ol>
              <li><strong>Paste</strong> your JSON into the editor.</li>
              <li><strong>Configure</strong> the class name, package, and optional generation settings.</li>
              <li><strong>Generate</strong> and review the Java classes as you edit the payload.</li>
              <li><strong>Copy or download</strong> the selected class, or download all classes as a ZIP.</li>
            </ol>
          </article>

          <article className="seo-card">
            <h2>Generate Java Classes from Complex JSON</h2>
            <p>The generator recursively handles nested objects, arrays of primitives, arrays of objects, null values, empty arrays, and mixed-type arrays. That makes it useful for API responses with several levels of nested data and reasonably large payloads.</p>
            <p>Nested object classes are generated separately, with the root class presented first in the output selector.</p>
          </article>

          <article className="seo-card seo-card-wide">
            <h2>Java Code Generation Options</h2>
            <div className="seo-feature-list">
              <span>Class and package naming</span>
              <span>camelCase or preserved field names</span>
              <span>Long or Integer mappings</span>
              <span>Wrapper or primitive types</span>
              <span>Java Records and Lombok</span>
              <span>Jackson or Gson annotations</span>
              <span>Getters and setters</span>
              <span>ISO date/time detection as Instant</span>
            </div>
          </article>

          <article className="seo-card">
            <h2>Why Use a JSON to Java Converter?</h2>
            <p>It reduces repetitive model creation, shortens the path from an API response to a usable DTO, and gives developers a consistent first draft for Java applications. The result can be copied into a REST client, refined in an IDE, and checked into the project like any other source file.</p>
          </article>
        </div>

        <section className="seo-faq" aria-labelledby="faq-heading">
          <div className="seo-faq-heading">
            <p className="intro-kicker">COMMON QUESTIONS</p>
            <h2 id="faq-heading">JSON to Java POJO Converter FAQ</h2>
          </div>
          <div className="faq-list">
            {faqItems.map(item => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
