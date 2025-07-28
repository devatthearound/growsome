import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('screenshot') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 파일명 생성
    const timestamp = Date.now();
    const filename = `screenshot-${timestamp}.${file.name.split('.').pop()}`;
    
    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'qa-screenshots');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // 디렉토리가 이미 존재하는 경우 무시
    }
    
    // 파일 저장
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    const url = `/uploads/qa-screenshots/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Failed to upload screenshot:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}