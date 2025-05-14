// Service Worker for Kire Testing Frontend

// Cache names
const STATIC_CACHE = 'kire-static-v1';
const RUNTIME_CACHE = 'kire-runtime-v1';
const API_CACHE = 'kire-api-v1';

// Assets to cache immediately during installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline-fallback.json',
  // Add CSS, JS, and other static assets as needed
];

// API routes to cache
const API_ROUTES = [
  '/api/products',
  '/api/tenants',
  '/api/components',
  '/api/environments',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[ServiceWorker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, API_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            console.log('[ServiceWorker] Removing old cache:', cacheToDelete);
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is for an API
const isApiRequest = (url) => {
  return url.pathname.startsWith('/api/');
};

// Helper function to determine if a request is for an HTML page
const isHtmlRequest = (request) => {
  return request.headers.get('accept').includes('text/html');
};

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // API requests - cache-first strategy with network fallback
  if (isApiRequest(url)) {
    event.respondWith(
      caches.open(API_CACHE)
        .then(cache => {
          return cache.match(event.request)
            .then(cachedResponse => {
              // Use cached response if available
              if (cachedResponse) {
                // Clone the response before returning it
                return cachedResponse.clone();
              }
              
              // Otherwise fetch from network
              return fetch(event.request)
                .then(networkResponse => {
                  // Cache the network response for future use
                  if (
                    networkResponse.ok && 
                    event.request.method === 'GET' &&
                    API_ROUTES.some(route => url.pathname.includes(route))
                  ) {
                    // Clone the response before caching it
                    cache.put(event.request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(error => {
                  console.error('[ServiceWorker] API fetch failed:', error);
                  
                  // If it's a known API endpoint, return a cached fallback
                  if (API_ROUTES.some(route => url.pathname.includes(route))) {
                    return caches.match('/offline-fallback.json');
                  }
                  
                  // Return an empty JSON response as last resort
                  return new Response(JSON.stringify({ 
                    error: 'You are offline',
                    offline: true,
                    message: 'Unable to fetch data while offline'
                  }), {
                    headers: { 'Content-Type': 'application/json' }
                  });
                });
            });
        })
    );
    return;
  }
  
  // HTML requests - network-first with offline fallback
  if (isHtmlRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If no cache, return the offline page
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // Other requests - stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Update the cache with a fresh version
            if (networkResponse.ok && event.request.method === 'GET') {
              const responseToCache = networkResponse.clone();
              caches.open(RUNTIME_CACHE)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('[ServiceWorker] Fetch failed:', error);
            return new Response('Network error', { status: 408, statusText: 'Offline' });
          });
          
        // Return cached response or wait for network
        return cachedResponse || fetchPromise;
      })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  // Handle custom messages
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cache invalidation
  if (event.data && event.data.type === 'INVALIDATE_CACHE') {
    const cacheName = event.data.cacheName || API_CACHE;
    const url = event.data.url;
    
    if (url) {
      caches.open(cacheName).then(cache => {
        cache.delete(url).then(success => {
          console.log(`[ServiceWorker] Cache invalidated for ${url}: ${success}`);
        });
      });
    } else {
      console.log('[ServiceWorker] No URL provided for cache invalidation');
    }
  }
});

// Handle background sync for queued requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'kire-sync-queue') {
    event.waitUntil(syncQueuedRequests());
  }
});

// Sync queued requests from IndexedDB
async function syncQueuedRequests() {
  // This would typically use IndexedDB to retrieve queued requests
  console.log('[ServiceWorker] Syncing queued requests');
  
  // For now, we'll just log that sync was attempted
  return Promise.resolve();
}
