import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();
  return Response.json(user);
}
