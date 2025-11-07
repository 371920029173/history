'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
import RichTextEditor from '@/components/RichTextEditor'

export default function CreatePage() {
  const router = useRouter()
  const [uploadKey, setUploadKey] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    if (!title && !description && !content && !files?.length) {
      setError('请至少填写一个字段（题目、介绍、内容或图片）')
      setSubmitting(false)
      return
    }

    try {
      const uploadedUrls: string[] = []
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const formData = new FormData()
          formData.append('file', file)

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.error || 'Failed to upload image')
          }

          const uploadResult = await uploadResponse.json()
          if (uploadResult.url) {
            uploadedUrls.push(uploadResult.url)
          }
        }
      }

      const autoTitle = title || (content ? content.replace(/<[^>]*>?/gm, '').substring(0, 20) : (uploadedUrls.length ? '图片集' : '无标题'))
      const autoDesc = description || undefined

      let finalContent = content || ''
      if (uploadedUrls.length > 0) {
        const imgsHtml = uploadedUrls
          .map((url) => `<p><img src="${url}" alt="image" /></p>`)
          .join('')
        finalContent = `${finalContent}${imgsHtml}`
      }

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: uploadKey,
          title: autoTitle || undefined,
          description: autoDesc || undefined,
          content: finalContent || undefined,
          image_url: uploadedUrls[0] || undefined,
          ts: Date.now(),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setUploadKey('') // 清除密钥
        // 清空表单
        setTitle('')
        setDescription('')
        setContent('')
        setFiles(null)
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(result.error || '创建失败')
        setUploadKey('') // 清除密钥
      }
    } catch (error) {
      console.error('Error creating entry:', error)
      setError('创建失败，请稍后重试')
      setUploadKey('') // 清除密钥
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/" className={styles.backButton}>
          ← 返回首页
        </Link>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>创建新记录</h1>

          {success && (
            <div className={styles.successMessage}>
              <p>✅ 记录创建成功！正在跳转...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="uploadKey">上传密钥 *</label>
              <input
                id="uploadKey"
                type="password"
                value={uploadKey}
                onChange={(e) => setUploadKey(e.target.value)}
                placeholder="输入上传密钥"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="title">题目</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入题目（可选）"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">介绍</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="输入介绍（可选）"
                rows={3}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="images">选择图片（可多选）</label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>内容（所见即所得，可直接输入普通文本）</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="输入内容（可留空，仅上传图片或只输入一句话也可）"
              />
            </div>

            <div className={styles.formGroup}>
              <small className={styles.note}>
                * 至少需要填写一个内容字段（题目、介绍、内容或图片链接）
              </small>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={styles.submitButton}
            >
              {submitting ? '创建中...' : '创建记录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

