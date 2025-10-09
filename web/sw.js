// Simple service worker for Solidi web app
// This provides basic offline functionality and prevents 404 errors

const CACHE_NAME = 'solidi-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Don't cache API calls - let them pass through to the proxy
  if (event.request.url.includes('/api2/') || event.request.url.includes('/v1/')) {
    console.log('🚫 Skipping cache for API call:', event.request.url);
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request).catch((error) => {
          console.log('❌ Network fetch failed:', error);
          // Return a fallback response for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          // For other requests, throw the error to prevent invalid Response conversion
          throw error;
        });
      })
      .catch((error) => {
        console.log('🚨 Cache match failed:', error);
        // Return a fallback response for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
        // Don't try to convert invalid responses
        return new Response('Service Worker Error', { 
          status: 503, 
          statusText: 'Service Worker Error' 
        });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});