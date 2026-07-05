// Sube este número cada vez que cambies el HTML/CSS/JS/iconos,
// para forzar que el Service Worker actualice la caché.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `fpp-${CACHE_VERSION}`;

// Todo lo que necesita la app para arrancar y funcionar sin conexión.
// Como el HTML es autocontenido (CSS y JS inline), solo hace falta
// cachear el propio HTML, el manifest y los iconos.
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './iconos/icon-180.png',
  './iconos/icon-192.png',
  './iconos/icon-512.png',
  './iconos/icon-512-maskable.png',
  './iconos/ios-512.png'
	
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // {cache: 'reload'} para asegurar que se descarga fresco de la red
    // y no de la caché HTTP del navegador.
    await Promise.all(
      APP_SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' })))
    );
  })());
  // Activa el nuevo SW sin esperar a que se cierren pestañas antiguas.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Borra cachés de versiones anteriores.
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    );
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);

    // Cache first: si está guardado, se sirve al instante.
    // Esto es lo que permite abrir la app aunque no haya datos.
    if (cached) {
      return cached;
    }

    try {
      const preloadResponse = event.preloadResponse
        ? await event.preloadResponse
        : null;
      const networkResponse = preloadResponse || (await fetch(event.request));

      if (networkResponse && networkResponse.ok) {
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // Sin red y sin caché: si es una navegación, devolvemos el HTML
      // principal como último recurso para que al menos abra la app.
      if (event.request.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      throw error;
    }
  })());
});
