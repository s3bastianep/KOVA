import HeroCandidateMockup from '@/components/landing/HeroCandidateMockup';

export default function HeroDemoMockup({ dark = false }) {
  return (
    <div className="relative w-full min-w-0 overflow-visible">
      <HeroCandidateMockup dark={dark} />
    </div>
  );
}
