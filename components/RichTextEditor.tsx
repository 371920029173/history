"use client"

import { useRef, useEffect } from 'react'
import styles from '@/app/create/page.module.css'

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || ''
    }
  }, [value])

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg)
  }

  const handleInput = () => {
    const html = ref.current?.innerHTML || ''
    onChange(html)
  }

  return (
    <div className={styles.rte}>
      <div className={styles.rteToolbar}>
        <button type="button" onClick={() => exec('bold')}>加粗</button>
        <button type="button" onClick={() => exec('italic')}>斜体</button>
        <button type="button" onClick={() => exec('underline')}>下划线</button>
        <button type="button" onClick={() => exec('insertUnorderedList')}>• 列表</button>
        <button type="button" onClick={() => exec('insertOrderedList')}>1. 列表</button>
      </div>
      <div
        ref={ref}
        className={styles.rteContent}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ outline: 'none' }}
      />
    </div>
  )
}


