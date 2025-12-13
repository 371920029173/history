import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '一班史记',
  description: '一班史记内容管理系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}



