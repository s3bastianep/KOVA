export default function HeroWave() {
  return (
    <div className="kv-wave-wrap" aria-hidden>
      <div className="kv-wave-label">
        <b>92%</b>
        <span>compatibilidad comercial</span>
      </div>
      <svg className="kv-wave-svg" viewBox="0 0 1200 190" preserveAspectRatio="none">
        <path
          className="kv-wave-path-a"
          d="M0,90 C60,40 120,140 180,80 C240,20 300,150 360,90 C420,30 480,140 540,95"
          stroke="#7D8AF0"
          strokeWidth="2"
          fill="none"
        />
        <path
          className="kv-wave-path-b"
          d="M0,110 C60,150 120,60 180,120 C240,170 300,50 360,110 C420,160 480,60 540,105"
          stroke="#E85C6B"
          strokeWidth="2"
          fill="none"
          opacity="0.55"
        />
        <path
          className="kv-wave-path-match"
          d="M540,100 C640,80 700,80 800,80 C900,80 1000,80 1200,80"
          stroke="#D8F24C"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="800" cy="80" r="5" fill="#D8F24C" />
      </svg>
    </div>
  );
}
