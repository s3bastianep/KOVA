import { NextRequest } from 'next/server';
import { getUserFromRequest, unauthorized } from '../../../../lib/auth';
import { buildExcelExportBuffer } from '../../../../lib/excel-export';

export const dynamic = 'force-dynamic';

const ADMIN_ROLES = new Set(['SUPER_ADMIN', 'COORDINATOR', 'CONSULTANT']);

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  if (!ADMIN_ROLES.has(user.role)) {
    return Response.json({ message: 'No tienes permiso para exportar datos.' }, { status: 403 });
  }

  try {
    const buffer = await buildExcelExportBuffer(user);
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `kova-export-${stamp}.xlsx`;

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[export/excel]', err);
    return Response.json({ message: 'No se pudo generar el archivo Excel.' }, { status: 500 });
  }
}
