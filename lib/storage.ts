// 数据存储层 - 使用文件系统（开发）或 Cloudflare KV（生产）
// 为了简单高效，使用 JSON 文件存储

import fs from 'fs';
import path from 'path';

export interface ContentItem {
  id: string;
  category: string;
  title?: string;
  subtitle?: string;
  content: string;
  mediaFiles?: string[];
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取所有内容
export async function getAllContent(): Promise<ContentItem[]> {
  ensureDataDir();
  
  if (!fs.existsSync(CONTENT_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取内容失败:', error);
    return [];
  }
}

// 根据ID获取内容
export async function getContentById(id: string): Promise<ContentItem | null> {
  const allContent = await getAllContent();
  return allContent.find(item => item.id === id) || null;
}

// 保存内容
export async function saveContent(content: ContentItem): Promise<void> {
  ensureDataDir();
  
  const allContent = await getAllContent();
  const existingIndex = allContent.findIndex(item => item.id === content.id);
  
  if (existingIndex >= 0) {
    allContent[existingIndex] = content;
  } else {
    allContent.push(content);
  }
  
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(allContent, null, 2), 'utf-8');
}

// 删除内容
export async function deleteContent(id: string): Promise<boolean> {
  ensureDataDir();
  
  const allContent = await getAllContent();
  const filtered = allContent.filter(item => item.id !== id);
  
  if (filtered.length === allContent.length) {
    return false; // 未找到要删除的内容
  }
  
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

// 获取所有类别
export async function getAllCategories(): Promise<string[]> {
  const allContent = await getAllContent();
  const categories = new Set<string>();
  
  allContent.forEach(item => {
    if (item.category) {
      categories.add(item.category);
    }
  });
  
  return Array.from(categories).sort();
}



