import React from 'react'

export default function GeneratorOptions({ options, setOptions }: { options: any; setOptions: (o: any) => void }) {
  return (
    <div className="p-3 border-t space-y-3">
      <div className="options-heading">
        <div>
          <h3>Generation options</h3>
          <p>Start with the essentials. Fine-tune the output when you need to.</p>
        </div>
      </div>
      <div>
        <label className="block text-sm">Class Name</label>
        <input className="w-full p-2 border rounded mt-1" value={options.rootClassName} onChange={e => setOptions({ ...options, rootClassName: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm">Package Name (optional)</label>
        <input className="w-full p-2 border rounded mt-1" value={options.packageName || ''} onChange={e => setOptions({ ...options, packageName: e.target.value || undefined })} />
      </div>

      <details className="advanced-options">
        <summary>Advanced options <span>Type mapping, annotations, naming</span></summary>
        <div className="advanced-options-content space-y-3">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={options.useLombok} onChange={e => setOptions({ ...options, useLombok: e.target.checked })} /> Use Lombok</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={options.useRecords} onChange={e => setOptions({ ...options, useRecords: e.target.checked })} /> Use Records</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={options.detectDates} onChange={e => setOptions({ ...options, detectDates: e.target.checked })} /> Detect date/time strings</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Integer Type</label>
              <select className="w-full p-2 border rounded mt-1" value={options.integerType} onChange={e => setOptions({ ...options, integerType: e.target.value })}>
                <option value="Long">Long</option>
                <option value="Integer">Integer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Use Wrapper Types</label>
              <select className="w-full p-2 border rounded mt-1" value={options.useWrapperTypes ? 'true' : 'false'} onChange={e => setOptions({ ...options, useWrapperTypes: e.target.value === 'true' })}>
                <option value="true">Yes</option>
                <option value="false">No (primitives)</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={options.generateGettersSetters} onChange={e => setOptions({ ...options, generateGettersSetters: e.target.checked })} /> Generate getters/setters</label>
          <div>
            <label className="block text-sm">Annotation Style</label>
            <select className="w-full p-2 border rounded mt-1" value={options.annotationStyle || (options.useJackson ? 'jackson' : 'none')} onChange={e => setOptions({ ...options, annotationStyle: e.target.value, useJackson: e.target.value === 'jackson' })}>
              <option value="none">None</option>
              <option value="jackson">Jackson</option>
              <option value="gson">Gson</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Field Naming Strategy</label>
            <div className="flex flex-wrap gap-3 mt-1">
              <label className="flex items-center gap-2"><input type="radio" name="fieldNaming" checked={options.fieldNaming === 'preserve'} onChange={() => setOptions({ ...options, fieldNaming: 'preserve' })} /> Preserve JSON names</label>
              <label className="flex items-center gap-2"><input type="radio" name="fieldNaming" checked={options.fieldNaming === 'camelCase'} onChange={() => setOptions({ ...options, fieldNaming: 'camelCase' })} /> camelCase</label>
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}
