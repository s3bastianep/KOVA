import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const APP_PREFIXES = [
  '/api',
  '/_next',
  '/login',
  '/acceso',
  '/postular',
  '/registro',
  '/dev',
  '/portal',
  '/dashboard',
  '/empresas',
  '/clientes',
  '/vacantes',
  '/procesos',
  '/pipeline-comercial',
  '/crm',
  '/calendario',
  '/agenda',
  '/tareas',
  '/reportes',
  '/configuracion',
  '/candidatos',
  '/discovery',
  '/ats',
  '/entrevistas',
  '/evaluaciones',
  '/finalistas',
  '/onboarding',
  '/academia',
  '/documentos',
  '/perfil-cargo',
];

function isAppRoute(pathname: string) {
  return APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /dev is a design-preview scaffold (hardcoded fixture data, no auth) — never serve it in prod.
  if (pathname === '/dev' || pathname.startsWith('/dev/')) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Not found', { status: 404 });
    }
    return NextResponse.next();
  }

  if (isAppRoute(pathname)) {
    return NextResponse.next();
  }

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.rewrite(new URL(`/www${pathname}`, request.url));
  }

  return NextResponse.rewrite(new URL('/www/index.html', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
