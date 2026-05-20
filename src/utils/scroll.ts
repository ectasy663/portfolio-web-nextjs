export const NAV_OFFSET = 80;

// Global callback to cancel any active programmatic scroll adjustment
let activeScrollCancel: (() => void) | null = null;

/**
 * Robust smooth scroll to an element by its ID selector.
 * Accounts for dynamic component loading (placeholder elements being swapped out by React),
 * layout shifts, images loading, and user scroll interruption.
 */
export function scrollToId(id: string, offset: number = NAV_OFFSET) {
  if (typeof window === 'undefined') return;
  
  // 1. Cancel any active programmatic scroll adjustment to prevent scroll-fighting
  if (activeScrollCancel) {
    activeScrollCancel();
    activeScrollCancel = null;
  }
  
  const selector = id.startsWith('#') ? id : `#${id}`;
  let el = document.querySelector(selector);
  
  // 2. Robust polling fallback if the element is not yet present in the DOM
  if (!el) {
    let retries = 0;
    const interval = window.setInterval(() => {
      el = document.querySelector(selector);
      retries++;
      if (el) {
        window.clearInterval(interval);
        performScroll(selector, el!, offset);
      } else if (retries > 30) {
        window.clearInterval(interval);
      }
    }, 50);
    
    activeScrollCancel = () => {
      window.clearInterval(interval);
    };
    return;
  }
  
  // 3. Begin smooth scroll tracking
  performScroll(selector, el, offset);
}

/**
 * Handles the actual smooth scroll logic, setting up observers to adjust target 
 * coordinates in real time as lazy chunks mount and layout shifts occur.
 */
function performScroll(selector: string, initialEl: Element, offset: number) {
  let observedEl = initialEl;
  let targetTop = observedEl.getBoundingClientRect().top + window.pageYOffset - offset;
  
  // Smooth scroll initially
  window.scrollTo({ top: targetTop, behavior: 'smooth' });

  let observer: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;
  let timeouts: number[] = [];
  
  // Centralized cleanup to disconnect observers and unregister event listeners
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
    timeouts.forEach((t) => window.clearTimeout(t));
    
    window.removeEventListener('wheel', onUserInteraction);
    window.removeEventListener('touchmove', onUserInteraction);
    window.removeEventListener('keydown', onUserInteraction);
    window.removeEventListener('mousedown', onUserInteraction);
    
    if (activeScrollCancel === cleanup) {
      activeScrollCancel = null;
    }
  };

  // If the user manually interacts, immediately halt programmatic adjustments
  const onUserInteraction = () => {
    cleanup();
  };

  // Register interactive events to listen for user overrides
  window.addEventListener('wheel', onUserInteraction, { passive: true });
  window.addEventListener('touchmove', onUserInteraction, { passive: true });
  window.addEventListener('keydown', onUserInteraction, { passive: true });
  window.addEventListener('mousedown', onUserInteraction, { passive: true });

  activeScrollCancel = cleanup;

  // Calculates current position and smooth scrolls if shifted
  const adjustScroll = () => {
    const currentEl = document.querySelector(selector);
    if (!currentEl) return;
    
    const newTargetTop = currentEl.getBoundingClientRect().top + window.pageYOffset - offset;
    
    // Correct position if shifted by more than 4px
    if (Math.abs(newTargetTop - targetTop) > 4) {
      targetTop = newTargetTop;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  // 4. ResizeObserver: High performance tracking of shifts and size changes
  if ('ResizeObserver' in window) {
    const handleResize = () => {
      const currentEl = document.querySelector(selector);
      if (currentEl && currentEl !== observedEl) {
        // Swap observed element since React swapped/mounted the real component over the placeholder
        observer?.unobserve(observedEl);
        observer?.observe(currentEl);
        observedEl = currentEl;
      }
      adjustScroll();
    };

    observer = new ResizeObserver(handleResize);
    observer.observe(observedEl);
    observer.observe(document.body);
  }

  // 5. MutationObserver: Reactive monitoring of child mounting/unmounting in the DOM tree
  if ('MutationObserver' in window) {
    mutationObserver = new MutationObserver(() => {
      const currentEl = document.querySelector(selector);
      if (currentEl && currentEl !== observedEl) {
        // React mounted the real component over the placeholder
        observer?.unobserve(observedEl);
        observer?.observe(currentEl);
        observedEl = currentEl;
      }
      adjustScroll();
    });
    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  const settle = () => {
    adjustScroll();
  };

  // 6. Progressive timeouts to double check and capture all incremental paints
  timeouts = [
    window.setTimeout(settle, 50),
    window.setTimeout(settle, 150),
    window.setTimeout(settle, 300),
    window.setTimeout(settle, 600),
    window.setTimeout(settle, 1000),
    window.setTimeout(settle, 1600),
    window.setTimeout(settle, 2400),
    window.setTimeout(settle, 3500),
    window.setTimeout(settle, 4500),
  ];

  // Self-terminate after 6 seconds to restore absolute scroll control & release memory
  timeouts.push(window.setTimeout(cleanup, 6000));
}

/**
 * Standard utility to scroll directly to an element reference
 */
export function scrollToElement(el: Element, offset: number = NAV_OFFSET) {
  if (typeof window === 'undefined') return;
  
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
