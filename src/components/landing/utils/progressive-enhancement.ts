"use client";

import { useEffect, useState } from 'react';

// Browser compatibility utilities
export const browserFeatures = {
  intersectionObserver: typeof window !== 'undefined' && 'IntersectionObserver' in window,
  webAnimations: typeof window !== 'undefined' && 'animate' in document.createElement('div'),
  passiveEvents: typeof window !== 'undefined' && (() => {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', () => {}, opts);
      window.removeEventListener('testPassive', () => {}, opts);
    } catch (e) {}
    return supportsPassive;
  })(),
  touchEvents: typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
  prefersReducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

// Progressive enhancement hook
export const useProgressiveEnhancement = () => {
  const [features, setFeatures] = useState(browserFeatures);
  const [isReducedMotion, setIsReducedMotion] = useState(features.prefersReducedMotion);

  useEffect(() => {
    // Update reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    ...features,
    isReducedMotion,
    // Animation utilities
    animate: (element: Element, keyframes: Keyframe[], options?: KeyframeAnimationOptions) => {
      if (features.webAnimations && element) {
        return element.animate(keyframes, options);
      }
      return null;
    },
    // Intersection Observer utility
    observe: (element: Element, callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
      if (features.intersectionObserver) {
        const observer = new IntersectionObserver(callback, options);
        observer.observe(element);
        return observer;
      }
      return null;
    },
    // Passive event listener utility
    addPassiveListener: (element: Element, event: string, handler: EventListener, options?: AddEventListenerOptions) => {
      if (features.passiveEvents) {
        element.addEventListener(event, handler, { passive: true, ...options });
      } else {
        element.addEventListener(event, handler, options);
      }
    }
  };
};

// Motion utilities with reduced motion support
export const createMotionVariants = (isReducedMotion: boolean) => {
  if (isReducedMotion) {
    return {
      initial: { opacity: 1, y: 0, x: 0 },
      animate: { opacity: 1, y: 0, x: 0 },
      exit: { opacity: 0 },
      transition: { duration: 0.01 }
    };
  }

  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: "easeOut" }
  };
};

// Touch gesture utilities
export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe || isUpSwipe || isDownSwipe) {
      return {
        direction: {
          left: isLeftSwipe,
          right: isRightSwipe,
          up: isUpSwipe,
          down: isDownSwipe
        },
        distance: {
          x: Math.abs(distanceX),
          y: Math.abs(distanceY)
        }
      };
    }

    return null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSupported: browserFeatures.touchEvents
  };
};

// Performance monitoring utilities
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    lcp: null as number | null,
    fid: null as number | null,
    cls: null as number | null,
    ttfb: null as number | null
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            setMetrics(prev => ({ ...prev, cls: clsValue }));
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      if (performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const navigation = navigationEntries[0];
          setMetrics(prev => ({
            ...prev,
            ttfb: navigation.responseStart - navigation.requestStart
          }));
        }
      }

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return metrics;
};

// Accessibility utilities
export const useAccessibility = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements((prev: string[]) => [...prev, message]);

    // Auto-remove after announcement
    setTimeout(() => {
      setAnnouncements((prev: string[]) => prev.slice(1));
    }, 1000);
  };

  return {
    announce,
    announcements,
    // Screen reader only content helper
    srOnlyProps: (text: string) => ({
      className: "sr-only",
      "aria-live": "polite" as const,
      children: text
    })
  };
};

export default {
  browserFeatures,
  useProgressiveEnhancement,
  createMotionVariants,
  useTouchGestures,
  usePerformanceMonitor,
  useAccessibility
};
