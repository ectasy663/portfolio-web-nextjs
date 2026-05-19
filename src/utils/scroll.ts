export const NAV_OFFSET = 80;

export function scrollToId(id: string, offset: number = NAV_OFFSET) {
  if (typeof window === 'undefined') return;
  
  const el = document.querySelector(id);
  if (!el) return;
  
  let targetTop = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: targetTop, behavior: 'smooth' });

  // Quick re-checks to correct layout shifts without repeated smooth crawling
  const settle = () => {
    const currentEl = document.querySelector(id);
    if (!currentEl) return;
    const newTargetTop = currentEl.getBoundingClientRect().top + window.pageYOffset - offset;
    if (Math.abs(newTargetTop - targetTop) > 6) {
      targetTop = newTargetTop;
      window.scrollTo({ top: targetTop, behavior: 'auto' });
    }
  };

  window.setTimeout(settle, 200);
  window.setTimeout(settle, 600);
  window.setTimeout(settle, 1200);
}

export function scrollToElement(el: Element, offset: number = NAV_OFFSET) {
  if (typeof window === 'undefined') return;
  
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
