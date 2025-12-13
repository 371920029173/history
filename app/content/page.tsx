'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

interface ContentItem {
  id: string;
  category: string;
  title?: string;
  subtitle?: string;
  content: string;
  mediaFiles?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ContentDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteKey, setDeleteKey] = useState('');

  useEffect(() => {
    if (id) {
      loadContent();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadContent = async () => {
    if (!id) return;
    
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success) {
        const item = data.data.find((item: ContentItem) => item.id === id);
        setContent(item || null);
      }
    } catch (error) {
      console.error('加载内容失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !deleteKey.trim()) {
      alert('请输入删除密钥');
      return;
    }

    try {
      const res = await fetch(`/api/content?id=${id}&key=${encodeURIComponent(deleteKey)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        alert('删除成功');
        router.push('/');
      } else {
        alert(data.error || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  if (!id) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>缺少内容ID参数</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>内容不存在</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← 返回
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => setShowDeleteConfirm(true)}
        >
          删除
        </button>
      </div>

      <article className={styles.content}>
        <div className={styles.category}>{content.category}</div>
        
        {content.title && (
          <h1 className={styles.title}>{content.title}</h1>
        )}
        
        {content.subtitle && (
          <h2 className={styles.subtitle}>{content.subtitle}</h2>
        )}

        {content.mediaFiles && content.mediaFiles.length > 0 && (
          <div className={styles.mediaSection}>
            {content.mediaFiles.map((url, index) => (
              <div key={index} className={styles.mediaItem}>
                {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img src={url} alt={`媒体 ${index + 1}`} className={styles.mediaImage} />
                ) : (
                  <a href={url} target="_blank" rel="noopener noreferrer" className={styles.mediaLink}>
                    查看文件: {url.split('/').pop()}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          className={styles.contentBody}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        <div className={styles.meta}>
          <div>创建时间: {new Date(content.createdAt).toLocaleString('zh-CN')}</div>
          {content.updatedAt !== content.createdAt && (
            <div>更新时间: {new Date(content.updatedAt).toLocaleString('zh-CN')}</div>
          )}
        </div>
      </article>

      {showDeleteConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>请输入删除密钥以确认删除此内容：</p>
            <input
              type="password"
              value={deleteKey}
              onChange={(e) => setDeleteKey(e.target.value)}
              placeholder="删除密钥"
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.modalButton}
                onClick={() => setShowDeleteConfirm(false)}
              >
                取消
              </button>
              <button
                className={`${styles.modalButton} ${styles.modalButtonDanger}`}
                onClick={handleDelete}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

