import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readData, writeData } from '@/lib/data';
import { randomUUID } from 'crypto';

export async function GET() {
  const data = readData();
  return NextResponse.json(data.posts);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { title, content, image } = await req.json();
  const data = readData();
  const post = {
    id: randomUUID(),
    title,
    content,
    image: image || '',
    createdAt: new Date().toISOString(),
  };
  data.posts.unshift(post);
  writeData(data);
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, title, content, image } = await req.json();
  const data = readData();
  data.posts = data.posts.map(p =>
    p.id === id ? { ...p, title, content, image: image || p.image } : p
  );
  writeData(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  const data = readData();
  data.posts = data.posts.filter(p => p.id !== id);
  writeData(data);
  return NextResponse.json({ ok: true });
}
