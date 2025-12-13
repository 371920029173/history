import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyKey } from '@/lib/auth';

export const dynamic = 'force-static';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const key = formData.get('key') as string;
    const file = formData.get('file') as File;

    // 验证密钥
    if (!verifyKey(key, 'upload')) {
      return NextResponse.json(
        { success: false, error: '密钥错误' },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: '未上传文件' },
        { status: 400 }
      );
    }

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // 确保目录存在
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // 清理文件名，移除特殊字符
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${safeFilename}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, data: { url: fileUrl, filename } });
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json(
      { success: false, error: '上传失败' },
      { status: 500 }
    );
  }
}

