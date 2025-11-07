"use client"

import { useEffect, useState } from 'react'

export default function EdgeDebugPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/edge-debug', { cache: 'no-store' })
        const text = await res.text()

        try {
          const json = JSON.parse(text)
          setData(json)
          if (!res.ok) {
            setError(json.error ? String(json.error) : `Request failed with status ${res.status}`)
          }
        } catch (parseError) {
          setError(`Failed to parse response: ${text}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main style={{ maxWidth: 800, margin: '3rem auto', fontFamily: 'monospace' }}>
      <h1>Edge Runtime Diagnostics</h1>
      {loading && <p>Loading…</p>}
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {data && (
        <pre
          style={{
            background: '#111',
            color: '#0f0',
            padding: '1rem',
            borderRadius: 8,
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  )
}
