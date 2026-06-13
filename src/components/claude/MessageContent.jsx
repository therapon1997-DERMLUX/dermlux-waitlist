import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

/* Renders an assistant answer as rich content:
   - markdown incl. GitHub tables (mobile-scrollable)
   - ```chart fenced blocks → recharts bar/line
   A chart block looks like:
   ```chart
   {"type":"bar","x":"city","y":"value","data":[{"city":"Λάρνακα","value":5569}]}
   ``` */

const PALETTE = ['#16a34a', '#9D835E', '#B392A4', '#7E88BC', '#C9B4C0', '#0ea5e9']

function Chart({ spec }) {
  let s
  try { s = typeof spec === 'string' ? JSON.parse(spec) : spec } catch { return null }
  const data = s.data || []
  if (!data.length) return null
  const x = s.x || 'label', y = s.y || 'value'
  return (
    <div className="my-2 bg-white rounded-lg border border-gray-200 p-2" style={{ height: 220 }}>
      {s.title && <div className="text-xs font-semibold text-gray-600 mb-1 px-1">{s.title}</div>}
      <ResponsiveContainer width="100%" height="100%">
        {s.type === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <XAxis dataKey={x} tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
            <Line type="monotone" dataKey={y} stroke="#16a34a" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <XAxis dataKey={x} tick={{ fontSize: 10 }} interval={0} /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
            <Bar dataKey={y} radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default function MessageContent({ text }) {
  // split out ```chart blocks, render the rest as markdown
  const parts = []
  const re = /```chart\s*([\s\S]*?)```/g
  let last = 0, m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ md: text.slice(last, m.index) })
    parts.push({ chart: m[1] })
    last = re.lastIndex
  }
  if (last < text.length) parts.push({ md: text.slice(last) })
  if (!parts.length) parts.push({ md: text })

  return (
    <div className="cc-md text-sm text-gray-800 leading-relaxed">
      {parts.map((p, i) => p.chart
        ? <Chart key={i} spec={p.chart} />
        : <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="min-w-full text-xs border-collapse" {...props} /></div>,
              th: ({ node, ...props }) => <th className="border border-gray-200 bg-gray-50 px-2 py-1 text-left font-semibold" {...props} />,
              td: ({ node, ...props }) => <td className="border border-gray-100 px-2 py-1" {...props} />,
              a: ({ node, ...props }) => <a className="text-green-700 underline" target="_blank" rel="noreferrer" {...props} />,
              code: ({ node, inline, ...props }) => inline
                ? <code className="bg-gray-100 rounded px-1 text-[12px]" {...props} />
                : <pre className="bg-gray-900 text-gray-100 rounded-lg p-2 overflow-x-auto text-[11px] my-2"><code {...props} /></pre>,
            }}>
            {p.md}
          </ReactMarkdown>)}
    </div>
  )
}
