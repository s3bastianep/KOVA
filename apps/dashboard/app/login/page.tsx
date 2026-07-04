import { LoginForm } from './LoginForm';

// Evita que el login quede cacheado estáticamente por un año (s-maxage) y
// sirva credenciales/markup viejos tras un deploy.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginPage() {
  return <LoginForm />;
}
