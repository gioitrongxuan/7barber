import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readData, writeData } from '@/lib/data';
import { randomUUID } from 'crypto';

export async function GET() {
  const data = readData();
  return NextResponse.json(data.services);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name, price, description } = await req.json();
  const data = readData();
  const service = { id: randomUUID(), name, price, description };
  data.services.push(service);
  writeData(data);
  return NextResponse.json(service);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, name, price, description } = await req.json();
  const data = readData();
  data.services = data.services.map(s =>
    s.id === id ? { ...s, name, price, description } : s
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
  data.services = data.services.filter(s => s.id !== id);
  writeData(data);
  return NextResponse.json({ ok: true });
}
