import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const SECRET = 'debug-manifiesta-2026';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('s') !== SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const keyPrefix = process.env.ANTHROPIC_API_KEY?.slice(0, 20) ?? 'NO KEY';
  const model = process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001 (default)';

  try {
    const ai = new Anthropic();
    const res = await ai.messages.create({
      model: process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'hola' }],
    });
    return NextResponse.json({
      ok: true,
      keyPrefix,
      model,
      reply: (res.content[0] as { text: string }).text,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      keyPrefix,
      model,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
