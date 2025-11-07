'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { HistoryEntry } from '@/lib/types'
import styles from './page.module.css'

export default function EntryPage() {
  const params = useParams()
  const router = useRouter()
  const [entry, setEntry] = useState<HistoryEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteForm, setShowDeleteForm] = useState(false)
  const [deleteKey, setDeleteKey] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchEntry(params.id as string)
    }
  }, [params.id])

  const fetchEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/entries/${id}`)
      const result = await response.json()
      if (result.data) {
        setEntry(result.data)
      } else {
        setError('记录不存在')
      }
    } catch (error) {
      console.error('Error fetching entry:', error)
      setError('加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/entries/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: deleteKey, ts: Date.now() }),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/')
      } else {
        setError(result.error || '删除失败')
        setDeleteKey('') // 清除密钥
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      setError('删除失败')
      setDeleteKey('') // 清除密钥
    } finally {
      setDeleting(false)
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    )
  }

  if (error && !entry) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <Link href="/" className={styles.backLink}>
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  if (!entry) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/" className={styles.backButton}>
          ← 返回首页
        </Link>

        <article className={styles.article}>
          {entry.image_url && (
            <div className={styles.imageContainer}>
              <img src={entry.image_url} alt={entry.title || '图片'} />
            </div>
          )}

          <header className={styles.header}>
            <h1 className={styles.title}>{entry.title || '无标题'}</h1>
            <time className={styles.date}>{formatDate(entry.created_at)}</time>
          </header>

          {entry.description && (
            <div className={styles.description}>
              <p>{entry.description}</p>
            </div>
          )}

          {entry.content && (
            <div className={styles.contentText}>
              <div dangerouslySetInnerHTML={{ __html: entry.content }} />
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={() => setShowDeleteForm(!showDeleteForm)}
              className={styles.deleteButton}
            >
              {showDeleteForm ? '取消删除' : '删除此记录'}
            </button>
          </div>

          {showDeleteForm && (
            <form onSubmit={handleDelete} className={styles.deleteForm}>
              <label htmlFor="deleteKey">删除密钥：</label>
              <input
                id="deleteKey"
                type="password"
                value={deleteKey}
                onChange={(e) => setDeleteKey(e.target.value)}
                placeholder="输入删除密钥"
                required
                className={styles.input}
              />
              {error && <p className={styles.errorText}>{error}</p>}
              <button
                type="submit"
                disabled={deleting}
                className={styles.submitButton}
              >
                {deleting ? '删除中...' : '确认删除'}
              </button>
            </form>
          )}
        </article>
      </div>
    </div>
  )
}

