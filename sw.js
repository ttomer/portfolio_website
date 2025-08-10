// Service Worker for Tomer's Portfolio
const CACHE_NAME = 'tomer-portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/animations.css',
    '/css/components.css',
    '/css/responsive.css',
    '/js/three-scene.js',
    '/js/video-loader.js',
    '/js/project-modal.js',
    '/js/timeline-animation.js',
    '/js/skills-animation.js',
    '/js/contact-form.js',
    '/assets/images/e.jpg',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch(function(error) {
                console.log('[ServiceWorker] Cache failed:', error);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
    console.log('[ServiceWorker] Fetch', event.request.url);
    
    // Skip caching for video files (too large)
    if (event.request.url.includes('.mov') || event.request.url.includes('.mp4')) {
        return fetch(event.request);
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    console.log('[ServiceWorker] Cache hit:', event.request.url);
                    return response;
                }

                // Cache miss - fetch from network
                return fetch(event.request)
                    .then(function(response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response as it can only be consumed once
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                // Only cache same-origin requests
                                if (event.request.url.startsWith(self.location.origin)) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return response;
                    })
                    .catch(function() {
                        // Return fallback page for navigation requests when offline
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', function(event) {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[ServiceWorker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for contact form (when online again)
self.addEventListener('sync', function(event) {
    console.log('[ServiceWorker] Background sync:', event.tag);
    if (event.tag === 'contact-form') {
        event.waitUntil(
            // Handle queued contact form submissions
            handleContactFormSync()
        );
    }
});

// Handle contact form sync when back online
function handleContactFormSync() {
    return new Promise((resolve) => {
        // This would integrate with your contact form logic
        console.log('[ServiceWorker] Syncing contact form submissions');
        resolve();
    });
}