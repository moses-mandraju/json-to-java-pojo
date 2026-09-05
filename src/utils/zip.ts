import JSZip from 'jszip'

export async function createZip(files: { name: string; content: string }[]) {
  const zip = new JSZip()
  for (const f of files) zip.file(f.name, f.content)
  return zip.generateAsync({ type: 'blob' })
}
