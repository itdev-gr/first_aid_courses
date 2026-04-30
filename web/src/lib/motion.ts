// web/src/lib/motion.ts
// Centralized GSAP setup. Imported only by client islands.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.defaults({
    duration: reduce ? 0 : 0.8,
    ease: 'power2.out',
  });

  if (reduce) {
    ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
  }
}

export { gsap, ScrollTrigger };
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
