'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface ContentItem {
  id: string;
  category: string;
  title?: string;
  subtitle?: string;
  content: string;
  mediaFiles?: string[];
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [filteredList, setFilteredList] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    loadContent();
    loadCategories();
  }, []);

  useEffect(() => {
    filterContent();
  }, [contentList, searchQuery, selectedCategories]);

  const loadContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success) {
        setContentList(data.data);
      }
    } catch (error) {
      console.error('加载内容失败:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('加载类别失败:', error);
    }
  };

  const filterContent = () => {
    let filtered = [...contentList];

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const subtitleMatch = item.subtitle?.toLowerCase().includes(query);
        const contentMatch = item.content.toLowerCase().includes(query);
        const categoryMatch = item.category.toLowerCase().includes(query);
        return titleMatch || subtitleMatch || contentMatch || categoryMatch;
      });
    }

    // 类别过滤
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => 
        selectedCategories.includes(item.category)
      );
    }

    setFilteredList(filtered);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const getPreviewText = (content: string) => {
    // 移除HTML标签，获取纯文本预览
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <div className={styles.container}>
      {/* 背景图 */}
      <div className={styles.heroBackground}>
        <div className={styles.heroOverlay} />
        <h1 className={styles.heroTitle}>一班史记</h1>
      </div>

      <div className={styles.mainContent}>
        {/* 搜索和筛选区域 */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="搜索内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.categorySection}>
            <div className={styles.categorySearchBox}>
              <input
                type="text"
                placeholder="搜索类别..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className={styles.categorySearchInput}
              />
            </div>
            <div className={styles.categoryTags}>
              {filteredCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`${styles.categoryTag} ${
                    selectedCategories.includes(category) ? styles.active : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 内容卡片 */}
        <div className={styles.contentGrid}>
          {filteredList.map(item => (
            <div
              key={item.id}
              className={styles.contentCard}
              onClick={() => router.push(`/content?id=${item.id}`)}
            >
              {item.mediaFiles && item.mediaFiles.length > 0 && (
                <div className={styles.cardImage}>
                  <img
                    src={item.mediaFiles[0]}
                    alt={item.title || '图片'}
                    className={styles.cardImageImg}
                  />
                </div>
              )}
              <div className={styles.cardContent}>
                <div className={styles.cardCategory}>{item.category}</div>
                {item.title && (
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                )}
                {item.subtitle && (
                  <h3 className={styles.cardSubtitle}>{item.subtitle}</h3>
                )}
                <p className={styles.cardPreview}>
                  {getPreviewText(item.content)}
                </p>
                <div className={styles.cardDate}>
                  {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredList.length === 0 && (
          <div className={styles.emptyState}>
            <p>暂无内容</p>
          </div>
        )}

        {/* 创建按钮 */}
        <button
          className={styles.createButton}
          onClick={() => router.push('/create')}
        >
          + 创建新内容
        </button>
      </div>
    </div>
  );
}

