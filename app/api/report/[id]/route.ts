import { NextRequest, NextResponse } from 'next/server';
import { getScan } from '@/lib/npm-audit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const report = getScan(params.id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  return NextResponse.json(report);
}
