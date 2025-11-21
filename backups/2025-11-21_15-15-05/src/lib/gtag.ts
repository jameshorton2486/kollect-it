/**
 * GA4 Analytics Event Tracking Utility
 *
 * Usage:
 *   gtag('event', 'view_item', {
 *     items: [{ item_id: '123', item_name: 'Product Name', price: 99.99 }]
 *   });
 *
 * Documentation:
 *   - Google Analytics 4 Events: https://developers.google.com/analytics/devguides/collection/ga4/events
 *   - Event Schema: https://support.google.com/analytics/answer/12229021
 */

export const gtag = (
  command: string,
  action: string,
  data?: Record<string, any>,
) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag(command, action, data);
  }
};

/**
 * Track product views
 * @param productId - Product ID/SKU
 * @param productName - Product name
 * @param category - Product category
 * @param price - Product price in USD
 */
export const trackViewItem = (
  productId: string,
  productName: string,
  category: string,
  price: number,
) => {
  gtag("event", "view_item", {
    currency: "USD",
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_category: category,
        price,
      },
    ],
  });
};

/**
 * Track add to cart actions
 * @param productId - Product ID/SKU
 * @param productName - Product name
 * @param category - Product category
 * @param price - Product price in USD
 * @param quantity - Quantity added
 */
export const trackAddToCart = (
  productId: string,
  productName: string,
  category: string,
  price: number,
  quantity: number = 1,
) => {
  gtag("event", "add_to_cart", {
    currency: "USD",
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_category: category,
        price,
        quantity,
      },
    ],
  });
};

/**
 * Track remove from cart actions
 * @param productId - Product ID/SKU
 * @param productName - Product name
 * @param category - Product category
 * @param price - Product price in USD
 * @param quantity - Quantity removed
 */
export const trackRemoveFromCart = (
  productId: string,
  productName: string,
  category: string,
  price: number,
  quantity: number = 1,
) => {
  gtag("event", "remove_from_cart", {
    currency: "USD",
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_category: category,
        price,
        quantity,
      },
    ],
  });
};

/**
 * Track begin checkout
 * @param items - Array of cart items
 * @param cartValue - Total cart value
 */
export const trackBeginCheckout = (
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }>,
  cartValue: number,
) => {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value: cartValue,
    items,
  });
};

/**
 * Track purchase completion
 * @param transactionId - Transaction/Order ID
 * @param items - Array of purchased items
 * @param totalValue - Total purchase value
 * @param tax - Tax amount (optional)
 * @param shipping - Shipping cost (optional)
 */
export const trackPurchase = (
  transactionId: string,
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    quantity: number;
  }>,
  totalValue: number,
  tax?: number,
  shipping?: number,
) => {
  gtag("event", "purchase", {
    transaction_id: transactionId,
    value: totalValue,
    currency: "USD",
    tax: tax || 0,
    shipping: shipping || 0,
    items,
  });
};

/**
 * Track page views (useful for SPAs or custom tracking)
 * @param pagePath - Page path/URL
 * @param pageTitle - Page title
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  gtag("event", "page_view", {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
};

/**
 * Track search queries
 * @param searchQuery - What the user searched for
 */
export const trackSearch = (searchQuery: string) => {
  gtag("event", "search", {
    search_term: searchQuery,
  });
};

/**
 * Track user sign up
 * @param signupMethod - Method used (email, google, etc.)
 */
export const trackSignUp = (signupMethod?: string) => {
  gtag("event", "sign_up", {
    method: signupMethod || "email",
  });
};

/**
 * Track user login
 * @param loginMethod - Method used (email, google, etc.)
 */
export const trackLogin = (loginMethod?: string) => {
  gtag("event", "login", {
    method: loginMethod || "email",
  });
};

/**
 * Custom event tracking
 * @param eventName - Event name (should follow GA4 naming conventions: snake_case)
 * @param data - Event data/parameters
 */
export const trackCustomEvent = (
  eventName: string,
  data?: Record<string, any>,
) => {
  gtag("event", eventName, data);
};

