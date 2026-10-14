// Προβολή παραστατικού: PDF σε ενσωματωμένο viewer, εικόνα ως εικόνα. Αναγνωρίζει τον τύπο από τα bytes,
// οπότε δουλεύει και για αρχεία που αποθηκεύτηκαν χωρίς σωστό content-type.
import { useEffect, useState } from 'react'
import { fetchFile } from './files'

export default function DocViewer({ fileUrl, fileName, className = '', height = 520, onLoaded }) {
  const [state, setState] = useState({ status: 'loading' })
  useEffect(() => {
    let alive = true, url = ''
    if (!fileUrl) { setState({ status: 'none' }); return }
    setState({ status: 'loading' })
    fetchFile(fileUrl, fileName).then(f => {
      if (!alive) return
      url = URL.createObjectURL(f.blob)
      setState({ status: 'ok', url, kind: f.kind })
      onLoaded?.(f)
    }).catch(err => alive && setState({ status: 'error', msg: err.message }))
    return () => { alive = false; if (url) URL.revokeObjectURL(url) }
  }, [fileUrl, fileName])

  const box = `w-full rounded-lg border border-gray-200 bg-gray-50 ${className}`
  if (state.status === 'none') return <div className={`${box} flex items-center justify-center text-sm text-gray-400`} style={{ height: 120 }}>Δεν υπάρχει συνημμένο αρχείο</div>
  if (state.status === 'loading') return <div className={`${box} flex items-center justify-center text-sm text-gray-400 animate-pulse`} style={{ height }}>Φόρτωση αρχείου…</div>
  if (state.status === 'error') return <div className={`${box} flex items-center justify-center text-sm text-red-600 px-4 text-center`} style={{ height: 140 }}>{state.msg || 'Το αρχείο δεν φορτώθηκε'}</div>
  if (state.kind === 'pdf') return <iframe title="Παραστατικό" src={`${state.url}#view=FitH`} className={box} style={{ height }} />
  if (state.kind === 'image') return (
    <div className={`${box} overflow-auto flex items-start justify-center`} style={{ maxHeight: height }}>
      <img src={state.url} alt="Παραστατικό" className="max-w-full h-auto" />
    </div>
  )
  return <div className={`${box} flex items-center justify-center text-sm text-gray-500 px-4 text-center`} style={{ height: 140 }}>Το αρχείο δεν προβάλλεται εδώ — πάτα «Λήψη».</div>
}
