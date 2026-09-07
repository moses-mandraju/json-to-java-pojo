import React, { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import Header from './components/Header'
import JsonEditor from './components/JsonEditor'
import JavaOutput from './components/JavaOutput'
import GeneratorOptions from './components/GeneratorOptions'
import SampleSelector from './components/SampleSelector'
import { safeParseJson } from './generator/jsonParser'
import { generateClassesFromJson, renderJavaClass } from './generator/classGenerator'
import { createZip } from './utils/zip'
import { JavaClass } from './types'

export default function App() {
  const [jsonText, setJsonText] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = window.localStorage.getItem('json-to-java-theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [options, setOptions] = useState<any>({
    rootClassName: 'Root',
    useLombok: false,
    useRecords: false,
    useJackson: false,
    annotationStyle: 'none',
    detectDates: false,
    integerType: 'Long',
    useWrapperTypes: true,
    generateGettersSetters: true,
    fieldNaming: 'preserve'
  })
  const [error, setError] = useState<string | null>(null)
  const [classes, setClasses] = useState<JavaClass[]>([])
  const [selectedClassName, setSelectedClassName] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('json-to-java-theme', theme)
    const favicon = document.getElementById('app-favicon') as HTMLLinkElement | null
    if (favicon) favicon.href = `/moses_mandraju_${theme === 'dark' ? 'dark' : 'light'}.png.png`
  }, [theme])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!jsonText.trim()) {
        setError(null)
        setClasses([])
        setSelectedClassName('')
        return
      }
      const parsed = safeParseJson(jsonText)
      if (parsed.error) { setError(parsed.error); setClasses([]); setSelectedClassName(''); return }
      setError(null)
      const cls = generateClassesFromJson(parsed.value, options)
      setClasses(cls)
      setSelectedClassName(current => cls.some(javaClass => javaClass.name === current) ? current : cls[0]?.name || '')
    }, 120)
    return () => window.clearTimeout(timer)
  }, [jsonText, options])

  const selectedClass = classes.find(javaClass => javaClass.name === selectedClassName) || classes[0]
  const code = useMemo(() => selectedClass ? renderJavaClass(selectedClass, options) : '// Generated code will appear here', [selectedClass, options])

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    alert('Copied to clipboard')
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.ctrlKey || event.metaKey
      if (!modifier) return
      if (event.key === 'Enter') {
        event.preventDefault()
        document.getElementById('generated-java')?.focus()
      }
      if (event.shiftKey && event.key.toLowerCase() === 'c') {
        event.preventDefault()
        void handleCopy()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [code])

  function handleDownload() {
    const blob = new Blob([code], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${selectedClass?.name || options.rootClassName || 'Root'}.java`
    a.click()
  }

  async function handleDownloadAll() {
    const files = classes.map((c, i) => ({ name: `${c.name}.java`, content: renderJavaClass(c, options) }))
    const blob = await createZip(files)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${options.rootClassName || 'Root'}-classes.zip`
    a.click()
  }

  return (
    <div className="h-screen flex flex-col">
      <Header onClear={() => setJsonText('')} theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <div className="privacy-banner" role="status">
        <ShieldCheck size={18} aria-hidden="true" />
        <span><strong>Private by design.</strong> Your JSON never leaves this browser.</span>
        <span className="privacy-banner-detail">No uploads. No accounts. No tracking of your payload.</span>
      </div>
      <main className="flex-1 flex flex-col gap-4 px-4 pb-5 max-w-[1800px] w-full mx-auto">
        <section className="tool-intro" aria-labelledby="tool-heading">
          <div className="intro-kicker"><Sparkles size={15} aria-hidden="true" /> BROWSER-ONLY DEVELOPER TOOL</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 id="tool-heading">Turn payloads into <span>production-ready Java.</span></h2>
              <p>Paste an API response, tune the model, and get clean POJOs without leaving your workspace.</p>
            </div>
            <div className="intro-flow" aria-label="Workflow"><span>Paste JSON</span><ArrowRight size={14} aria-hidden="true" /><span>Shape types</span><ArrowRight size={14} aria-hidden="true" /><span>Ship classes</span></div>
          </div>
        </section>
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <section className="w-full lg:w-1/2 min-h-[520px] lg:h-full border rounded-xl flex flex-col tool-panel overflow-hidden" aria-labelledby="json-input-heading">
          <JsonEditor theme={theme} value={jsonText} onChange={setJsonText} onSample={() => setJsonText('{\n  "id":101,\n  "name":"John"\n}')} onFormat={() => { try { setJsonText(JSON.stringify(JSON.parse(jsonText), null, 2)) } catch { } }} />
          <GeneratorOptions options={options} setOptions={setOptions} />
          <SampleSelector onSelect={s => setJsonText(s)} />
        </section>
        <section className="w-full lg:w-1/2 min-h-[520px] lg:h-full border rounded-xl flex flex-col tool-panel overflow-hidden">
          <JavaOutput code={code} classes={classes} selectedClass={selectedClass?.name || ''} onSelectClass={setSelectedClassName} onCopy={handleCopy} onDownload={handleDownload} onDownloadAll={handleDownloadAll} />
          <div aria-live="polite" className="px-3 py-2 text-xs border-t status-bar">
            {error ? <span className="text-red-600 dark:text-red-400">Invalid JSON: {error}</span> : jsonText.trim() ? `Valid JSON • ${classes.length} class${classes.length === 1 ? '' : 'es'} generated` : 'Paste JSON to begin'}
            <span className="float-right">{jsonText.length.toLocaleString()} characters</span>
          </div>
          {jsonText.length > 1_000_000 && <p className="px-3 pb-2 text-xs text-amber-700 dark:text-amber-300">Large payload: generation may take longer in this browser.</p>}
        </section>
        </div>
      </main>
      <footer className="px-4 py-3 text-sm muted-copy border-t">Built for fast, private transformations in your browser.</footer>
    </div>
  )
}
