/**
 * Service Worker for Dashboard PKM Ciwandan
 * Version: 1.0.0
 * 
 * Strategy:
 * - Cache-first for static assets (CSS, JS, fonts, images)
 * - Network-first for API calls (Google Apps Script)
 * - Stale-while-revalidate for CDN resources
 */

const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `pkm-ciwandan-${CACHE_VERSION}`;

// Assets to cache on install (shell)
const SHELL_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './icons/CIwandan/android/android-launchericon-192-192.png',
  './icons/CIwandan/android/android-launchericon-512-512.png'
];

// CDN resources to cache (stale-while-revalidate)
const CDN_RESOURCES = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Google Apps Script URL pattern
const GAS_URL_PATTERN = /script\.google\.com|script\.googleusercontent\.com/;

// ============================================
// INSTALL EVENT
// ============================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching shell assets...');
        return cache.addAll(SHELL_ASSETS);
      })
      .then(() => {
        console.log('[SW] Shell cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache shell:', error);
      })
  );
});

// ============================================
// ACTIVATE EVENT
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('pkm-ciwandan-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients...');
        return self.clients.claim();
      })
  );
});

// ============================================
// FETCH EVENT
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Strategy selection based on request type
  if (GAS_URL_PATTERN.test(url.href)) {
    // Network-first for Google Apps Script (API calls)
    event.respondWith(networkFirst(request));
  } else if (isCDNResource(url.href)) {
    // Stale-while-revalidate for CDN resources
    event.respondWith(staleWhileRevalidate(request));
  } else if (isStaticAsset(url.pathname)) {
    // Cache-first for static assets
    event.respondWith(cacheFirst(request));
  } else {
    // Network-first for everything else
    event.respondWith(networkFirst(request));
  }
});

// ============================================
// CACHING STRATEGIES
// ============================================

/**
 * Cache-first strategy
 * Good for: Static assets that rarely change
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('[SW] Cache hit:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return caches.match('./offline.html');
  }
}

/**
 * Network-first strategy
 * Good for: API calls, dynamic content
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('./offline.html');
    }
    
    throw error;
  }
}

/**
 * Stale-while-revalidate strategy
 * Good for: CDN resources, frequently updated content
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Start network fetch in background
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Background fetch failed:', error);
      return null;
    });
  
  // Return cached immediately if available, otherwise wait for network
  if (cachedResponse) {
    console.log('[SW] Serving stale:', request.url);
    return cachedResponse;
  }
  
  return networkPromise || caches.match('./offline.html');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function isStaticAsset(pathname) {
  const staticExtensions = [
    '.html', '.css', '.js', '.json',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
    '.woff', '.woff2', '.ttf', '.eot',
    '.mp3', '.mp4', '.webm'
  ];
  
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

function isCDNResource(url) {
  return CDN_RESOURCES.some(cdn => url.startsWith(cdn)) ||
    url.includes('cdn.') ||
    url.includes('cdnjs.') ||
    url.includes('jsdelivr.');
}

// ============================================
// BACKGROUND SYNC (for offline actions)
// ============================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-chatbot') {
    event.waitUntil(syncChatbotMessages());
  }
});

async function syncChatbotMessages() {
  // Placeholder for future offline chatbot sync
  console.log('[SW] Syncing chatbot messages...');
}

// ============================================
// PUSH NOTIFICATIONS (for future use)
// ============================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Ada update data kesehatan baru!',
    icon: './icons/CIwandan/android/android-launchericon-192-192.png',
    badge: './icons/CIwandan/android/android-launchericon-72-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'open', title: 'Buka Dashboard' },
      { action: 'close', title: 'Tutup' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('PKM Ciwandan', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// ============================================
// MESSAGE HANDLER (for cache control from app)
// ============================================
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared');
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  if (event.data.action === 'getCacheStats') {
    event.waitUntil(
      getCacheStats().then((stats) => {
        event.ports[0].postMessage(stats);
      })
    );
  }
});

async function getCacheStats() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  
  return {
    version: CACHE_VERSION,
    cacheName: CACHE_NAME,
    entries: keys.length,
    urls: keys.map(req => req.url)
  };
}

console.log('[SW] Service Worker loaded - Version:', CACHE_VERSION);

