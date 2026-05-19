export const NAV_OFFSET = 80;

export function scrollToId(id: string, offset: number = NAV_OFFSET) {
  if (typeof window === 'undefined') return;
  
  const el = document.querySelector(id);
  if (!el) return;
  
  let targetTop = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: targetTop, behavior: 'smooth' });

  // Robust check to handle layout shifts from lazy-loaded components
  const checkInterval = setInterval(() => {
    const currentEl = document.querySelector(id);
    if (!currentEl) {
      clearInterval(checkInterval);
      return;
    }
    
    const newTargetTop = currentEl.getBoundingClientRect().top + window.pageYOffset - offset;
    
    // If the target position shifts significantly, update the scroll
    if (Math.abs(newTargetTop - targetTop) > 10) {
      targetTop = newTargetTop;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }, 200);

  // Clear monitoring after 2 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 2500);
}

export function scrollToElement(el: Element, offset: number = NAV_OFFSET) {
  if (typeof window === 'undefined') return;
  
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
