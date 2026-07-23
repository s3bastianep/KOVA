import { prisma } from './prisma';
import { isMockMode } from './mock';

const DEFAULT_SLUG = 'kova';

export async function getPublicTenantId(): Promise<string> {
  if (isMockMode()) return 'mock-tenant-001';

  const slug =
    process.env.LITT_HUNTER_PUBLIC_TENANT_SLUG ??
    process.env.KOVA_PUBLIC_TENANT_SLUG ??
    DEFAULT_SLUG;
  const tenant = await prisma.tenant.upsert({
    where: { slug },
    update: { isActive: true },
    create: {
      name: 'Litt Hunter',
      slug,
      plan: 'enterprise',
      isActive: true,
    },
    select: { id: true },
  });

  return tenant.id;
}
