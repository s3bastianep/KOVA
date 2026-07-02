import { redirect } from 'next/navigation';

export default async function VacanteRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/procesos/${id}`);
}
