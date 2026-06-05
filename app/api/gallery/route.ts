import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readData, writeData } from '@/lib/data';
import { randomUUID } from 'crypto';

export async function GET() {
  const data = readData();
  return NextResponse.json(data.gallery);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { url, caption } = await req.json();
  const data = readData();
  const item = {
    id: randomUUID(),
    url,
    caption: caption || '',
    createdAt: new Date().toISOString(),
  };
  data.gallery.push(item);
  writeData(data);
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  const data = readData();
  data.gallery = data.gallery.filter(g => g.id !== id);
  writeData(data);
  return NextResponse.json({ ok: true });
}
