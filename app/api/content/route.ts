import { NextRequest, NextResponse } from 'next/server';
import { getAllContent, saveContent, deleteContent } from '@/lib/storage';
import { verifyKey } from '@/lib/auth';

export const dynamic = 'force-static';

// GET - 获取所有内容
export async function GET() {
  try {
    const content = await getAllContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取内容失败' },
      { status: 500 }
    );
  }
}

// POST - 创建或更新内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, id, category, title, subtitle, content, mediaFiles } = body;

    // 验证密钥
    if (!verifyKey(key, 'upload')) {
      return NextResponse.json(
        { success: false, error: '密钥错误' },
        { status: 401 }
      );
    }

    // 验证必填字段
    if (!category || !content) {
      return NextResponse.json(
        { success: false, error: '类别和内容为必填项' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const contentItem = {
      id: id || `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category,
      title: title || undefined,
      subtitle: subtitle || undefined,
      content,
      mediaFiles: mediaFiles || undefined,
      createdAt: id ? (await getAllContent()).find(item => item.id === id)?.createdAt || now : now,
      updatedAt: now,
    };

    await saveContent(contentItem);

    return NextResponse.json({ success: true, data: contentItem });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '保存内容失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除内容
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const key = searchParams.get('key');

    if (!id || !key) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 验证密钥
    if (!verifyKey(key, 'delete')) {
      return NextResponse.json(
        { success: false, error: '密钥错误' },
        { status: 401 }
      );
    }

    const success = await deleteContent(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: '内容不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '删除内容失败' },
      { status: 500 }
    );
  }
}



