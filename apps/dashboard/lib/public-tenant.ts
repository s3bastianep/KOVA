import { prisma } from './prisma';
import { isMockMode } from './mock';

const DEFAULT_SLUG = 'kova';

export async function getPublicTenantId(): Promise<string> {
  if (isMockMode()) return 'mock-tenant-001';

  const slug = process.env.KOVA_PUBLIC_TENANT_SLUG ?? DEFAULT_SLUG;
  const tenant = await prisma.tenant.findFirst({
    where: { slug, isActive: true },
    select: { id: true },
  });

  if (!tenant) {
    throw new Error(`Tenant público no configurado (slug: ${slug})`);
  }

  return tenant.id;
}
