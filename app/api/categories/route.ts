import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/storage';

// GET - 获取所有类别
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取类别失败' },
      { status: 500 }
    );
  }
}



