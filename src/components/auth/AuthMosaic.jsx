export default function AuthMosaic() {
  return (
    <div className="kv-auth-mosaic" aria-hidden>
      <div className="kv-auth-mosaic__grid">
        <div className="kv-auth-mosaic__block kv-auth-mosaic__block--ink">
          <span className="kv-auth-mosaic__shape kv-auth-mosaic__shape--ring" />
        </div>
        <img
          className="kv-auth-mosaic__block kv-auth-mosaic__block--photo"
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
          alt=""
        />
        <div className="kv-auth-mosaic__block kv-auth-mosaic__block--lime">
          <span className="kv-auth-mosaic__shape kv-auth-mosaic__shape--dot" />
        </div>
        <div className="kv-auth-mosaic__block kv-auth-mosaic__block--coral" />
        <div className="kv-auth-mosaic__block kv-auth-mosaic__block--teal">
          <span className="kv-auth-mosaic__shape kv-auth-mosaic__shape--zigzag" />
        </div>
        <img
          className="kv-auth-mosaic__block kv-auth-mosaic__block--photo"
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
          alt=""
        />
        <div className="kv-auth-mosaic__block kv-auth-mosaic__block--cream" />
        <div className="kv-auth-mosaic__block kv-auth-mosaic__block--violet">
          <span className="kv-auth-mosaic__shape kv-auth-mosaic__shape--check">✓</span>
        </div>
        <div className="kv-auth-mosaic__block kv-auth-mosaic__block--sky" />
      </div>
    </div>
  );
}
