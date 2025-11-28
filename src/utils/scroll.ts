export const NAV_OFFSET = 80;

export function scrollToId(id: string, offset: number = NAV_OFFSET) {
  if (typeof window === 'undefined') return;
  
  const el = document.querySelector(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function scrollToElement(el: Element, offset: number = NAV_OFFSET) {
  if (typeof window === 'undefined') return;
  
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
