import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'VulnGuard — Autonomous NPM Security System',
    team: 'Hack-It-Up',
    leader: 'Aradhya Saraf',
    member: 'Chinmay Muddapur',
    event: 'HackZion V3 by AMCEC 2026',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
