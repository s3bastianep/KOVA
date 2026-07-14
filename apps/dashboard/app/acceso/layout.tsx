import type { ReactNode } from 'react';

export default function AccesoLayout({ children }: { children: ReactNode }) {
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
