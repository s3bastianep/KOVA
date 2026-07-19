/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_DASHBOARD_URL?: string;
  readonly VITE_APP_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __kovaPortalWarmed?: boolean;
  __kovaLenis?: { scrollTo: (target: Element | string | number, options?: object) => void };
}
