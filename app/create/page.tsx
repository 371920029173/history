'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface EditorBlock {
  id: string;
  type: 'text' | 'media';
  content: string;
  style?: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
  };
  mediaUrl?: string;
}

export default function CreatePage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: '1', type: 'text', content: '' }
  ]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [uploadKey, setUploadKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [captcha, setCaptcha] = useState({ question: '', answer: 0, userAnswer: '' });
  const [showCaptcha, setShowCaptcha] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({
      question: `${num1} + ${num2} = ?`,
      answer: num1 + num2,
      userAnswer: '',
    });
  };

  const addTextBlock = () => {
    const newBlock: EditorBlock = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlock(newBlock.id);
  };

  const addMediaBlock = (url: string) => {
    const newBlock: EditorBlock = {
      id: Date.now().toString(),
      type: 'media',
      mediaUrl: url,
      content: '',
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlock(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<EditorBlock>) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
      if (selectedBlock === id) {
        setSelectedBlock(null);
      }
    }
  };

  const handleFileSelect = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', uploadKey);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        addMediaBlock(data.data.url);
      } else {
        alert(data.error || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败');
    }
  };

  const handleSave = async () => {
    if (!category.trim()) {
      alert('请输入类别');
      return;
    }

    if (!uploadKey.trim()) {
      setShowKeyInput(true);
      return;
    }

    if (!showCaptcha) {
      setShowCaptcha(true);
      return;
    }

    if (parseInt(captcha.userAnswer) !== captcha.answer) {
      alert('验证码错误，请重新计算');
      generateCaptcha();
      setCaptcha(prev => ({ ...prev, userAnswer: '' }));
      return;
    }

    // 将blocks转换为HTML内容
    const htmlContent = blocks.map(block => {
      if (block.type === 'media') {
        return `<div class="content-media"><img src="${block.mediaUrl}" alt="媒体内容" /></div>`;
      } else {
        const style = block.style || {};
        const styleStr = Object.entries(style)
          .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
          })
          .join('; ');
        
        const tag = style.fontSize && style.fontSize > 20 ? 'h2' : 'p';
        return `<${tag}${styleStr ? ` style="${styleStr}"` : ''}>${block.content || '<br />'}</${tag}>`;
      }
    }).join('');

    const mediaFiles = blocks
      .filter(block => block.type === 'media' && block.mediaUrl)
      .map(block => block.mediaUrl!);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: uploadKey,
          category,
          title: title.trim() || undefined,
          subtitle: subtitle.trim() || undefined,
          content: htmlContent,
          mediaFiles: mediaFiles.length > 0 ? mediaFiles : undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('保存成功！');
        // 清除密钥
        setUploadKey('');
        router.push(`/content?id=${data.data.id}`);
      } else {
        alert(data.error || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    }
  };

  const selectedBlockData = blocks.find(b => b.id === selectedBlock);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← 返回
        </button>
        <h1>创建内容</h1>
        <button className={styles.saveButton} onClick={handleSave}>
          保存
        </button>
      </div>

      <div className={styles.editorLayout}>
        {/* 操作台 */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarSection}>
            <h3>基本信息</h3>
            <input
              type="text"
              placeholder="类别 *"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="题目（可选）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="副标题（可选）"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.toolbarSection}>
            <h3>上传密钥</h3>
            {showKeyInput ? (
              <>
                <input
                  type="password"
                  placeholder="请输入上传密钥"
                  value={uploadKey}
                  onChange={(e) => setUploadKey(e.target.value)}
                  className={styles.input}
                />
                <button
                  className={styles.button}
                  onClick={() => {
                    if (uploadKey.trim()) {
                      setShowKeyInput(false);
                    }
                  }}
                >
                  确认
                </button>
              </>
            ) : (
              <button
                className={styles.button}
                onClick={() => setShowKeyInput(true)}
              >
                输入上传密钥
              </button>
            )}
          </div>

          {showCaptcha && (
            <div className={styles.toolbarSection}>
              <h3>人机验证</h3>
              <div className={styles.captcha}>
                <span>{captcha.question}</span>
                <input
                  type="text"
                  value={captcha.userAnswer}
                  onChange={(e) => setCaptcha(prev => ({ ...prev, userAnswer: e.target.value }))}
                  className={styles.input}
                  placeholder="答案"
                />
                <button className={styles.button} onClick={generateCaptcha}>
                  换一题
                </button>
              </div>
            </div>
          )}

          <div className={styles.toolbarSection}>
            <h3>添加内容</h3>
            <button className={styles.button} onClick={addTextBlock}>
              + 添加文本
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
            <button
              className={styles.button}
              onClick={() => fileInputRef.current?.click()}
            >
              + 添加媒体
            </button>
          </div>

          {selectedBlockData && (
            <div className={styles.toolbarSection}>
              <h3>格式设置</h3>
              {selectedBlockData.type === 'text' && (
                <>
                  <div className={styles.formatRow}>
                    <label>字号:</label>
                    <input
                      type="number"
                      min="12"
                      max="72"
                      value={selectedBlockData.style?.fontSize || 16}
                      onChange={(e) => updateBlock(selectedBlock!, {
                        style: {
                          ...selectedBlockData.style,
                          fontSize: parseInt(e.target.value) || 16,
                        }
                      })}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.formatButtons}>
                    <button
                      className={`${styles.formatButton} ${
                        selectedBlockData.style?.fontWeight === 'bold' ? styles.active : ''
                      }`}
                      onClick={() => updateBlock(selectedBlock!, {
                        style: {
                          ...selectedBlockData.style,
                          fontWeight: selectedBlockData.style?.fontWeight === 'bold' ? 'normal' : 'bold',
                        }
                      })}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      className={`${styles.formatButton} ${
                        selectedBlockData.style?.fontStyle === 'italic' ? styles.active : ''
                      }`}
                      onClick={() => updateBlock(selectedBlock!, {
                        style: {
                          ...selectedBlockData.style,
                          fontStyle: selectedBlockData.style?.fontStyle === 'italic' ? 'normal' : 'italic',
                        }
                      })}
                    >
                      <em>I</em>
                    </button>
                    <button
                      className={`${styles.formatButton} ${
                        selectedBlockData.style?.textDecoration === 'underline' ? styles.active : ''
                      }`}
                      onClick={() => updateBlock(selectedBlock!, {
                        style: {
                          ...selectedBlockData.style,
                          textDecoration: selectedBlockData.style?.textDecoration === 'underline' ? 'none' : 'underline',
                        }
                      })}
                    >
                      <u>U</u>
                    </button>
                    <button
                      className={`${styles.formatButton} ${
                        selectedBlockData.style?.textDecoration === 'line-through' ? styles.active : ''
                      }`}
                      onClick={() => updateBlock(selectedBlock!, {
                        style: {
                          ...selectedBlockData.style,
                          textDecoration: selectedBlockData.style?.textDecoration === 'line-through' ? 'none' : 'line-through',
                        }
                      })}
                    >
                      <s>S</s>
                    </button>
                  </div>
                  <div className={styles.formatRow}>
                    <label>对齐:</label>
                    <select
                      value={selectedBlockData.style?.textAlign || 'left'}
                      onChange={(e) => updateBlock(selectedBlock!, {
                        style: {
                          ...selectedBlockData.style,
                          textAlign: e.target.value as any,
                        }
                      })}
                      className={styles.select}
                    >
                      <option value="left">左对齐</option>
                      <option value="center">居中</option>
                      <option value="right">右对齐</option>
                    </select>
                  </div>
                  <div className={styles.formatRow}>
                    <label>文字颜色:</label>
                    <input
                      type="color"
                      value={selectedBlockData.style?.color || '#000000'}
                      onChange={(e) => updateBlock(selectedBlock!, {
                        style: {
                          ...selectedBlockData.style,
                          color: e.target.value,
                        }
                      })}
                      className={styles.colorInput}
                    />
                  </div>
                </>
              )}
              <button
                className={styles.deleteButton}
                onClick={() => selectedBlock && deleteBlock(selectedBlock)}
              >
                删除此块
              </button>
            </div>
          )}
        </div>

        {/* 预览区 */}
        <div className={styles.preview}>
          <div className={styles.previewContent}>
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={`${styles.block} ${
                  selectedBlock === block.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedBlock(block.id)}
              >
                {block.type === 'text' ? (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    placeholder="输入文本内容..."
                    className={styles.textArea}
                    style={{
                      fontSize: block.style?.fontSize || 16,
                      fontWeight: block.style?.fontWeight || 'normal',
                      fontStyle: block.style?.fontStyle || 'normal',
                      textDecoration: block.style?.textDecoration || 'none',
                      textAlign: block.style?.textAlign || 'left',
                      color: block.style?.color || '#000',
                      backgroundColor: block.style?.backgroundColor || 'transparent',
                    }}
                  />
                ) : (
                  <div className={styles.mediaBlock}>
                    {block.mediaUrl && (
                      <>
                        {block.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img src={block.mediaUrl} alt="媒体" className={styles.mediaPreview} />
                        ) : (
                          <div className={styles.mediaPlaceholder}>
                            <a href={block.mediaUrl} target="_blank" rel="noopener noreferrer">
                              查看文件: {block.mediaUrl.split('/').pop()}
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                <div className={styles.blockIndex}>{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



