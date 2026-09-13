import React from 'react'
import { Braces, Hash, Type } from 'lucide-react'
import { CodeFile, TargetLanguage } from '../types'

export default function JavaOutput({ code, files, selectedClass, language, onSelectLanguage, onSelectClass, onCopy, onDownload, onDownloadAll }: { code: string; files: CodeFile[]; selectedClass: string; language: TargetLanguage; onSelectLanguage: (language: TargetLanguage) => void; onSelectClass: (name: string) => void; onCopy: () => void; onDownload: () => void; onDownloadAll: () => void }) {
  const languageLabel = language === 'java' ? 'Java' : language === 'csharp' ? 'C#' : 'TypeScript'
  const languageOptions: { value: TargetLanguage; label: string; icon: React.ReactNode }[] = [
    { value: 'java', label: 'Java', icon: <Braces size={14} aria-hidden="true" /> },
    { value: 'csharp', label: 'C#', icon: <Hash size={14} aria-hidden="true" /> },
    { value: 'typescript', label: 'TS', icon: <Type size={14} aria-hidden="true" /> }
  ]
  return (
    <div className="h-full flex flex-col">
      <div className="output-toolbar flex flex-wrap items-center justify-between gap-2 p-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="shrink-0 whitespace-nowrap text-sm font-medium">Generated Code</h2>
          <div className="language-switcher" role="group" aria-label="Select target language">
            {languageOptions.map(option => <button key={option.value} type="button" className={`language-option ${language === option.value ? 'is-active' : ''}`} aria-pressed={language === option.value} onClick={() => onSelectLanguage(option.value)} title={option.value === 'java' ? 'Generate Java POJO' : option.value === 'csharp' ? 'Generate C# class' : 'Generate TypeScript interface'}>
              {option.icon}<span>{option.label}</span>
            </button>)}
          </div>
          {files.length > 1 && <select aria-label={`Select generated ${languageLabel} file`} className="h-9 max-w-full px-2 py-0 border rounded-lg tool-button text-sm" value={selectedClass} onChange={event => onSelectClass(event.target.value)}>
            {files.map(file => <option key={file.name} value={file.name}>{file.name}</option>)}
          </select>}
        </div>
        <div className="output-actions flex shrink-0 gap-2">
          <button className="h-9 whitespace-nowrap px-3 py-0 border rounded-lg tool-button text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" onClick={onCopy} aria-label={`Copy generated ${languageLabel}`}>Copy</button>
          <button className="h-9 whitespace-nowrap px-3 py-0 border rounded-lg tool-button text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" onClick={onDownload} aria-label={`Download current ${languageLabel} file`}>Download</button>
          <button className="h-9 whitespace-nowrap px-3 py-0 border rounded-lg tool-button-primary text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" onClick={onDownloadAll} aria-label={`Download all generated ${languageLabel} files as ZIP`}>Download All</button>
        </div>
      </div>
      <pre id="generated-java" tabIndex={-1} aria-label={`Generated ${languageLabel} source code`} className="flex-1 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm overflow-auto editor">
        <code className="whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  )
}
