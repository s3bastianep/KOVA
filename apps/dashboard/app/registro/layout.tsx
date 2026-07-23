import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Registro de candidatos | Litt Hunter',
  description:
    'Completa tu perfil comercial y te avisamos cuando haya una vacante que encaje contigo.',
};

export default function RegistroLayout({ children }: { children: ReactNode }) {
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
