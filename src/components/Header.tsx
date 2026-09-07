import React from 'react'
import { Linkedin, Moon, Sun, Trash } from 'lucide-react'

export default function Header({ onClear, theme, toggleTheme }: { onClear: () => void; theme: string; toggleTheme: () => void }) {
  return (
    <header className="navbar px-5 py-4 border-b bg-[var(--surface)] border-[var(--line)]">
      <div className="navbar-logo" aria-label="Moses Mandraju">
        <img src={`/moses_mandraju_${theme === 'dark' ? 'dark' : 'light'}.png.png`} alt="" />
      </div>
      <div className="navbar-title">
        <h1 className="text-xl font-bold tracking-tight">JSON <span className="text-[var(--accent)]">→</span> Java POJO</h1>
        <p className="text-sm muted-copy">Convert JSON into clean Java POJOs instantly.</p>
      </div>
      <div className="flex items-center justify-end gap-3">
        <a href="https://www.linkedin.com/in/moses-mandraju-5a38b0195" target="_blank" rel="noreferrer" aria-label="Open LinkedIn profile" className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" title="LinkedIn"><Linkedin /></a>
        <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" title="Toggle theme">{theme === 'dark' ? <Sun /> : <Moon />}</button>
        <button onClick={onClear} aria-label="Clear JSON input" className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" title="Clear input"><Trash /></button>
      </div>
    </header>
  )
}
