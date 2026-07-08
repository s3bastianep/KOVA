import { Link } from 'react-router-dom';
import { dashboardHref, isDashboardPath } from '@/lib/dashboardLinks';

import { prefetchLandingInnerStyles } from '@/lib/prefetchLandingInnerStyles';

function prefetchInnerStyles() {
  void prefetchLandingInnerStyles();
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
