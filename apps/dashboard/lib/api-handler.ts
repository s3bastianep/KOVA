/**
 * Red de seguridad para rutas del API: cualquier excepción no manejada (Prisma,
 * red, bugs) queda registrada en el servidor con su etiqueta de ruta y el cliente
 * recibe SIEMPRE un JSON 500 genérico — nunca la página HTML de error de Next ni
 * detalles internos (stack traces, mensajes de la DB).
 *
 * Uso:
 *   export const GET = withApiErrors('candidatos', async (req: NextRequest) => { ... });
 *
 * Las rutas pueden seguir teniendo try/catch internos para errores con mensajes
 * específicos; este wrapper solo captura lo que se escape.
 */
export function withApiErrors<Args extends unknown[]>(
  label: string,
  handler: (...args: Args) => Promise<Response>,
  options?: { headers?: Record<string, string> },
): (...args: Args) => Promise<Response> {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error(`[api/${label}]`, err);
      return Response.json(
        { message: 'Error interno. Intenta de nuevo en unos minutos.' },
        { status: 500, headers: options?.headers },
      );
    }
  };
}
