import React from 'react'

const samples = {
  simple: `{
  "id": 101,
  "name": "John Doe",
  "active": true
}`,
  nested: `{
  "id": 101,
  "name": "John Doe",
  "address": { "city": "Hyderabad", "country": "India" }
}`
}

export default function SampleSelector({ onSelect }: { onSelect: (s: string) => void }) {
  return (
    <div className="p-3 border-t">
      <h3 className="text-sm font-medium">Samples</h3>
      <div className="flex gap-2 mt-2">
        <button className="px-2 py-1 border rounded" onClick={() => onSelect(samples.simple)}>Simple</button>
        <button className="px-2 py-1 border rounded" onClick={() => onSelect(samples.nested)}>Nested</button>
      </div>
    </div>
  )
}
