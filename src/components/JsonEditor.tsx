import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'

export default function JsonEditor({ value, onChange, onSample, onFormat, theme }: { value: string; onChange: (v: string) => void; onSample: () => void; onFormat: () => void; theme: 'light' | 'dark' }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2">
        <h2 className="font-medium">JSON Input</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={onSample} aria-label="Load sample JSON">Sample</button>
          <button className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={onFormat} aria-label="Format JSON input">Format</button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto border-t">
        <CodeMirror
          value={value}
          height="100%"
          placeholder={'{\n  "id": 101,\n  "name": "Your name",\n  "active": true\n}'}
          extensions={[json(), ...(theme === 'dark' ? [oneDark] : [])]}
          onChange={onChange}
          basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }}
          className="editor text-sm"
          aria-label="JSON input editor"
        />
      </div>
    </div>
  )
}
