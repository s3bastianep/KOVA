import { Link } from 'react-router-dom';
import { dashboardHref, isDashboardPath } from '@/lib/dashboardLinks';

function prefetchInnerStyles() {
  void import('@/lib/loadLandingPagesStyles');
}

export default function NavLinkItem({ to, className, style, children }) {
  if (isDashboardPath(to)) {
    return (
      <a href={dashboardHref(to)} className={className} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={className}
      style={style}
      onMouseEnter={prefetchInnerStyles}
      onFocus={prefetchInnerStyles}
    >
      {children}
    </Link>
  );
}
