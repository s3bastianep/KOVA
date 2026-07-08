export default function SignalStrip() {
  return (
    <section className="kv-signal-strip" aria-hidden>
      <div className="kv-signal-head">
        <div className="kv-wrap kv-signal-head-inner">
          <div className="kv-signal-label kv-signal-label--left">
            <b className="font-display">Percepción</b>
            <span>sin evidencia ni estructura</span>
          </div>
        </div>
        <div className="kv-signal-label kv-signal-label--right">
          <b className="font-display">92%</b>
          <span className="font-mono">Kova Score</span>
        </div>
      </div>

      <div className="kv-signal-wave-wrap">
        <svg className="kv-signal-wave" viewBox="0 0 1600 130" preserveAspectRatio="none" shapeRendering="geometricPrecision">
          <path
            d="M0,60 C60,20 120,20 180,60 C240,100 300,100 360,60 C420,20 480,20 540,60 C580,85 610,74 645,66"
            fill="none"
            stroke="#3341C4"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d="M0,82 C60,122 120,122 180,82 C240,42 300,42 360,82 C420,122 480,122 540,82 C570,66 605,72 645,68"
            fill="none"
            stroke="#E85C6B"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d="M645,67 C760,52 860,42 980,38 C1150,32 1350,28 1600,22"
            fill="none"
            stroke="#D8F24C"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <span className="kv-signal-dot kv-signal-dot--mid" aria-hidden />
        <span className="kv-signal-dot kv-signal-dot--end" aria-hidden>
          <span className="kv-signal-dot-ring" />
          <span className="kv-signal-dot-core" />
        </span>
      </div>
    </section>
  );
}
