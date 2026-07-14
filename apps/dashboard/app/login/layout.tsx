import type { ReactNode } from 'react';

/** Keeps document shell dark while login/acceso paint, so leaving the landing doesn't flash cream. */
export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            'html,body{background:#0a0b0a!important;background-image:none!important;scrollbar-gutter:stable}',
        }}
      />
      {children}
    </>
  );
}
