/** @type {import('next').NextConfig} */
const nextConfig = {
  // 对于 Cloudflare Pages，使用静态导出
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 如果需要使用 Cloudflare 特定功能，取消下面的注释
  // experimental: {
  //   runtime: 'edge',
  // },
}

module.exports = nextConfig
