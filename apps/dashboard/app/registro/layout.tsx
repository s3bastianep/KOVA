import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro de candidatos | Kova',
  description:
    'Completa tu perfil comercial y te avisamos cuando haya una vacante que encaje contigo.',
};

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
