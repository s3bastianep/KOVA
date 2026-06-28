import KovaDashboardMockup from '@/components/landing/KovaDashboardMockup';

export default function HeroDemoMockup() {
  return (
    <div className="relative w-full min-w-0">
      <div
        className="relative rounded-xl overflow-hidden w-full bg-white"
        style={{
          border: '1px solid #E2E6ED',
          boxShadow: '0 8px 32px rgba(15,31,61,0.08), 0 16px 48px rgba(26,63,170,0.04)',
        }}
      >
        <KovaDashboardMockup hero />
      </div>
    </div>
  );
}
