'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HistoryEntry } from '@/lib/types'
import styles from './page.module.css'

export default function Home() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchData = () => {
      fetchEntries()
    }
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchData, { timeout: 2000 })
    } else {
      setTimeout(fetchData, 0)
    }
  }, [])

  const fetchEntries = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch('/api/entries', {
        signal: controller.signal,
        cache: 'default',
      })

      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: 'Failed to fetch entries', details: errorText }
        }
        console.error('Error fetching entries:', errorData)
        return
      }
      
      const result = await response.json()
      if (result && result.data) {
        setEntries(result.data)
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error fetching entries:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const scoreTitle = (q: string, title: string) => {
    const a = (title || '').toLowerCase()
    const b = q.toLowerCase().trim()
    if (!b) return 0
    if (a === b) return 1000
    const idx = a.indexOf(b)
    if (idx === -1) return 0
    return 500 - idx * 5 + Math.max(0, 50 - Math.abs(a.length - b.length))
  }

  const filtered = entries
    .map((e) => ({ e, s: scoreTitle(query, e.title || '') }))
    .filter(({ s }) => (query ? s > 0 : true))
    .sort((a, b) => b.s - a.s)
    .map(({ e }) => e)

  return (
    <div className={styles.container}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.backgroundImage}></div>
        <div className={styles.backgroundOverlay}></div>
      </div>
      
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>一班史记</h1>
        </header>

        <div className={styles.toolbar}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题..."
            className={styles.searchInput}
          />
          <Link href="/create" className={styles.createButton}>
            创建新记录
          </Link>
        </div>

        <div className={styles.communityRow}>
          <a href="https://community-e7i.pages.dev" target="_blank" rel="noreferrer" className={styles.communityLink}>
            前往社区
          </a>
        </div>

        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>暂无历史记录</p>
            <Link href="/create" className={styles.createLink}>
              创建第一条记录
            </Link>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {filtered.map((entry, index) => (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                className={styles.card}
                style={{ '--index': index } as React.CSSProperties}
              >
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>
                    {entry.title || '无标题'}
                  </h2>
                  {entry.description && (
                    <p className={styles.cardDescription}>
                      {entry.description.length > 100
                        ? `${entry.description.substring(0, 100)}...`
                        : entry.description}
                    </p>
                  )}
                  <div className={styles.cardFooter}>
                    <span className={styles.cardDate}>
                      {formatDate(entry.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

