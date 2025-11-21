/**
 * Web Vitals Monitoring
 *
 * Tracks Core Web Vitals and sends them to your analytics service
 * Uses native browser APIs (no external dependencies)
 *
 * Web Vitals tracked:
 * - LCP (Largest Contentful Paint): How quickly the main content loads
 * - FID (First Input Delay): How responsive the page is to interactions
 * - CLS (Cumulative Layout Shift): Visual stability of the page
 */

// Performance thresholds (in milliseconds)
const THRESHOLDS = {
  LCP: 2500, // Good: <= 2.5s
  FID: 100, // Good: <= 100ms
  CLS: 0.1, // Good: <= 0.1
  FCP: 1800, // First Contentful Paint
  TTFB: 600, // Time to First Byte
};

/**
 * Sends a metric to your analytics service
 * Update this function to integrate with your analytics provider
 * (Google Analytics, Datadog, New Relic, etc.)
 */
function sendMetricToAnalytics(metricName: string, value: number) {
  // Example: Send to Google Analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", metricName, {
      value: Math.round(value),
      event_category: "Web Vitals",
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metricName}:`, `${Math.round(value)}ms`);
  }
}

/**
 * Determine if a metric is "good", "needs improvement", or "poor"
 * TODO: Use this in analytics dashboard for metric status indicators
 */
// @ts-ignore - Reserved for future dashboard feature
function getMetricStatus(
  metricName: string,
  value: number,
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];

  if (!threshold) return "good";

  if (value <= threshold) return "good";
  if (value <= threshold * 1.5) return "needs-improvement";
  return "poor";
}

/**
 * Initialize Web Vitals tracking using PerformanceObserver
 * Call this once when your app loads
 */
export function initWebVitalsTracking() {
  // Only track in production or when explicitly enabled
  if (
    process.env.NODE_ENV !== "production" &&
    !process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS
  ) {
    return;
  }

  if (typeof window === "undefined") return;

  try {
    // Track Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;

          sendMetricToAnalytics(
            "LCP",
            lastEntry.renderTime || lastEntry.loadTime,
          );
        });

        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // LCP not supported
      }
    }

    // Track Cumulative Layout Shift (CLS)
    if ("PerformanceObserver" in window) {
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }

          sendMetricToAnalytics("CLS", clsValue);
        });

        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (e) {
        // CLS not supported
      }
    }

    // Track First Contentful Paint (FCP)
    if ("PerformanceObserver" in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          sendMetricToAnalytics("FCP", lastEntry.startTime);
          fcpObserver.disconnect();
        });

        fcpObserver.observe({ entryTypes: ["paint"] });
      } catch (e) {
        // FCP not supported
      }
    }

    // Track Time to First Byte (TTFB) using Navigation Timing API
    if ("performance" in window && (window as any).performance.timing) {
      window.addEventListener("load", () => {
        const timing = (window as any).performance.timing;
        const ttfb = timing.responseStart - timing.navigationStart;
        sendMetricToAnalytics("TTFB", ttfb);
      });
    }
  } catch (error) {
    console.error("Failed to initialize Web Vitals tracking:", error);
  }
}

/**
 * Performance monitoring utility for custom metrics
 *
 * @example
 * const perf = new PerformanceMonitor('API Call');
 * perf.start();
 * await fetchData();
 * perf.end(); // Logs: "API Call: 234ms"
 */
export class PerformanceMonitor {
  private name: string;
  private startTime: number = 0;

  constructor(name: string) {
    this.name = name;
  }

  start(): void {
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${this.name}: ${Math.round(duration)}ms`);
    }

    return duration;
  }

  mark(label: string): void {
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(`${this.name}-${label}`);
    }
  }
}

/**
 * Lazy loading observer for images and components
 * Automatically loads content when it becomes visible
 */
export function setupLazyLoadingObserver() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLImageElement;

          // For images with data-src attribute
          if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute("data-src");
          }

          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: "50px", // Start loading 50px before element enters viewport
    },
  );

  // Observe all lazy-loadable elements
  document.querySelectorAll("[data-src]").forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Prefetch links on hover for faster navigation
 * Reduces navigation latency by preloading resources
 */
export function setupLinkPrefetching() {
  if (typeof document === "undefined") return;

  document.addEventListener("mouseover", (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest("a") as HTMLAnchorElement | null;

    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    // Create a prefetch link element
    const prefetch = document.createElement("link");
    prefetch.rel = "prefetch";
    prefetch.href = href;
    document.head.appendChild(prefetch);
  });
}

