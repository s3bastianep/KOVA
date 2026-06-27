import { useEffect, useState } from 'react';

export default function useGuiaActiveSection(tocItems) {
  const [activeId, setActiveId] = useState(tocItems[0]?.id ?? '');

  useEffect(() => {
    if (!tocItems.length) return undefined;

    const ids = tocItems.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  return activeId;
}
