import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readData, writeData } from '@/lib/data';

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const shop = await req.json();
  const data = readData();
  data.shop = { ...data.shop, ...shop };
  writeData(data);
  return NextResponse.json({ ok: true });
}
