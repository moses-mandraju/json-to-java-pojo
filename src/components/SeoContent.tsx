import React from 'react'
import { RouteConfig } from '../seo/routeConfig'

export default function SeoContent({ config }: { config: RouteConfig }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  }
  const languageName = config.route === 'java' ? 'Java' : config.route === 'csharp' ? 'C#' : config.route === 'typescript' ? 'TypeScript' : 'Code'
  const converterName = config.route === 'home' ? 'JSON to Code Converter' : `JSON to ${languageName} Converter`

  return (
    <section className="seo-content" aria-labelledby="seo-heading">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="seo-content-inner">
        <header className="seo-lead">
          <p className="intro-kicker">{config.kicker}</p>
          <h2 id="seo-heading">{config.heading}</h2>
          <p>{config.intro}</p>
          <nav className="seo-route-links" aria-label="JSON to Code tools">
            <a href="/">JSON to Code</a>
            <a href="/json-to-java">JSON to Java</a>
            <a href="/json-to-csharp">JSON to C#</a>
            <a href="/json-to-typescript">JSON to TypeScript</a>
          </nav>
        </header>

        <div className="seo-grid">
          <article className="seo-card seo-card-wide">
            <h2>What is a {converterName}?</h2>
            <p>{config.route === 'java' ? 'A JSON to Java converter reads a JSON payload and maps its properties to Java fields and types. It gives developers a structured starting point for POJOs, DTOs, Records, and model classes.' : config.route === 'csharp' ? 'A JSON to C# converter reads a JSON payload and maps its properties to C# classes and properties. It provides a useful starting point for API models and application data contracts.' : config.route === 'typescript' ? 'A JSON to TypeScript converter reads a JSON payload and maps its properties to TypeScript interfaces. It provides a typed starting point for frontend applications and API clients.' : 'A JSON to code converter reads a JSON payload and maps its properties to fields in a selected target language. It generates a structured starting point for Java, C#, or TypeScript.'}</p>
            <p>This tool is client-side: the JSON is parsed locally, and generated source is treated as plain text in the browser.</p>
          </article>

          <article className="seo-card">
            <h2>How to Convert JSON to {languageName}</h2>
            <ol>
              <li><strong>Paste</strong> your JSON into the editor.</li>
              <li><strong>Choose</strong> the target language and relevant options.</li>
              <li><strong>Review</strong> the generated {config.formatName}.</li>
              <li><strong>Copy or download</strong> one file or all files as a ZIP.</li>
            </ol>
          </article>

          <article className="seo-card">
            <h2>Generate {languageName} from Complex JSON</h2>
            <p>The shared generator handles nested objects, arrays of primitives, arrays of objects, null values, empty arrays, and mixed-type arrays. Nested object types are generated separately, with the root type presented first.</p>
          </article>

          <article className="seo-card seo-card-wide">
            <h2>{languageName} Code Generation Options</h2>
            <div className="seo-feature-list">{config.features.map(feature => <span key={feature}>{feature}</span>)}</div>
          </article>

          <article className="seo-card seo-card-wide">
            <h2>Why Use This JSON Converter?</h2>
            <p>It reduces repetitive model creation, shortens the path from an API response to usable source files, and gives developers a consistent first draft that can be refined in an IDE and checked into a project.</p>
          </article>
        </div>

        <section className="seo-faq" aria-labelledby="faq-heading">
          <div className="seo-faq-heading"><p className="intro-kicker">COMMON QUESTIONS</p><h2 id="faq-heading">{languageName === 'Code' ? 'JSON to Code FAQ' : `JSON to ${languageName} FAQ`}</h2></div>
          <div className="faq-list">{config.faqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
        </section>
      </div>
    </section>
  )
}
