import React from 'react'
import { JavaClass } from '../types'

export default function JavaOutput({ code, classes, selectedClass, onSelectClass, onCopy, onDownload, onDownloadAll }: { code: string; classes: JavaClass[]; selectedClass: string; onSelectClass: (name: string) => void; onCopy: () => void; onDownload: () => void; onDownloadAll: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-3">
          <h2 className="font-medium">Generated Java</h2>
          {classes.length > 1 && <select aria-label="Select generated Java class" className="px-2 py-1 border rounded-lg tool-button text-sm" value={selectedClass} onChange={event => onSelectClass(event.target.value)}>
            {classes.map(javaClass => <option key={javaClass.name} value={javaClass.name}>{javaClass.name}.java</option>)}
          </select>}
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-lg tool-button focus:outline-none focus:ring-2 focus:ring-cyan-500" onClick={onCopy} aria-label="Copy generated Java">Copy</button>
          <button className="px-3 py-1 border rounded-lg tool-button focus:outline-none focus:ring-2 focus:ring-cyan-500" onClick={onDownload} aria-label="Download current Java class">Download</button>
          <button className="px-3 py-1 border rounded-lg tool-button-primary focus:outline-none focus:ring-2 focus:ring-cyan-500" onClick={onDownloadAll} aria-label="Download all generated Java classes as ZIP">Download All</button>
        </div>
      </div>
      <pre id="generated-java" tabIndex={-1} aria-label="Generated Java source code" className="flex-1 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm overflow-auto editor">
        <code className="whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  )
}
