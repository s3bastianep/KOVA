import KovaDashboardMockup from '@/components/landing/KovaDashboardMockup';

export default function HeroDemoMockup() {
  return (
    <div className="relative w-full min-w-0">
      <div
        className="relative rounded-2xl overflow-hidden w-full"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(226,230,237,0.9)',
          boxShadow: '0 1px 2px rgba(15,31,61,0.04), 0 12px 40px rgba(15,31,61,0.06), 0 24px 64px rgba(26,63,170,0.04)',
        }}
      >
        <KovaDashboardMockup hero />
      </div>
    </div>
  );
}
