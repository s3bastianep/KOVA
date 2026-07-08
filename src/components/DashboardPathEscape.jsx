import { useEffect } from 'react';
import { isDashboardPath } from '@/lib/dashboardLinks';

/** Si la landing SPA cargó en una ruta de Next (ej. /portal), forzar recarga al servidor. */
export default function DashboardPathEscape() {
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    if (isDashboardPath(pathname)) {
      window.location.replace(`${pathname}${search}${hash}`);
    }
  }, []);

  return null;
}
