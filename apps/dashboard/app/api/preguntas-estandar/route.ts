import { NextRequest } from 'next/server';
import { STANDARD_QUESTIONS } from '../../../lib/standard-questions';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    questions: STANDARD_QUESTIONS,
    categories: [...new Set(STANDARD_QUESTIONS.map((q) => q.category))],
  });
}
