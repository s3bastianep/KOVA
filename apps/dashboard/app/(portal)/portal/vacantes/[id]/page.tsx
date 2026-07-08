import { PortalVacanteDetailClient } from '@/components/portal/PortalVacanteDetailClient';

export default async function PortalVacanteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PortalVacanteDetailClient vacancyId={id} />;
}
