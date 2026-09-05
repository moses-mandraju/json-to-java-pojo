# JSON to Java POJO Generator

Convert JSON to clean Java POJOs instantly. This is a client-side React + TypeScript app built with Vite and Tailwind.

 JSON to Java POJO Generator

 Fast, private developer utility for converting JSON payloads into clean Java POJO, DTO, Lombok, or record source files. JSON parsing and code generation run entirely in the browser.

 ## Features

 - Recursive generation for nested objects, primitive arrays, object arrays, nulls, empty arrays, and mixed arrays
 - Configurable root class, package, naming strategy, integer type, wrapper types, getters/setters, and date detection
 - Jackson `@JsonProperty` and Gson `@SerializedName` annotations
 - Java Records and Lombok `@Data`
 - Copy, single-class download, and ZIP download for all generated classes
 - CodeMirror JSON editor with syntax highlighting, folding, and line numbers
 - Light/dark themes, keyboard shortcuts, validation status, character counts, and large-input warnings

 ## Tech Stack

 React, TypeScript, Vite, Tailwind CSS, CodeMirror, Lucide React, and JSZip. There is no backend, database, authentication, analytics, or external API dependency for core functionality.

 ## Architecture

 - `src/components/` contains the editor, options, output, header, and sample UI.
 - `src/generator/` contains parsing, type inference, naming, and Java rendering logic independent of React.
 - `src/utils/` contains browser download helpers.
 - `tests/` contains Vitest tests for the generation engine.

 ## Local Development

 ```bash
 npm install
 npm run dev
 ```

 Open the URL printed by Vite, normally `http://localhost:5173`.

 ## Verification

 ```bash
 npm run type-check
 npm test -- --run
 npm run build
 ```

 ## Deployment

 The app is a static Vite site and deploys directly to Vercel with no environment variables:

 - Build command: `npm run build`
 - Output directory: `dist`

 ## Privacy Model

 Your JSON is processed entirely in your browser and is never uploaded to our servers. The application does not send JSON content, generated source, tokens, or credentials to external services. JSON input is not saved to localStorage; only the theme preference is persisted.

 ## How to Use

 1. Paste or load sample JSON.
 2. Configure generation options.
 3. Review the generated Java source.
 4. Copy or download the class files.

 ## Future Roadmap

 Potential tools for the developer-tools platform include JSON formatting and validation, JSON to TypeScript, JWT decoding, Base64 conversion, UUID generation, SQL formatting, XML formatting, YAML conversion, and cron generation.

 ## Screenshots

 Add product screenshots here as the interface evolves.

Local development:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Privacy: JSON is processed entirely in your browser.
