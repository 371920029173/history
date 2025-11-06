import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // 优化字体加载
  preload: true,
})

export const metadata: Metadata = {
  title: '一班史记',
  description: '记录历史的网站',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 预加载背景图片 */}
        <link rel="preload" href="/background.jpg" as="image" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

