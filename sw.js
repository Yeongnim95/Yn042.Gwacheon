const CACHE_VERSION = 'scoynim-shell-20260914a';
const NOTIFICATION_DB_NAME = 'scoynim-notifications';
const NOTIFICATION_DB_VERSION = 1;
const NOTIFICATION_STORE_NAME = 'messages';
const NOTIFICATION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
function savePushNotification(payload) {
  if (!self.indexedDB) return Promise.resolve();
  return new Promise((resolve) => {
    const request = indexedDB.open(NOTIFICATION_DB_NAME, NOTIFICATION_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.objectStoreNames.contains(NOTIFICATION_STORE_NAME)
        ? request.transaction.objectStore(NOTIFICATION_STORE_NAME)
        : db.createObjectStore(NOTIFICATION_STORE_NAME, { keyPath: 'id' });
      if (!store.indexNames.contains('createdAt')) store.createIndex('createdAt', 'createdAt');
    };
    request.onerror = () => resolve();
    request.onsuccess = () => {
      const db = request.result;
      const createdAt = Number(payload.createdAt) || Date.now();
      const id = payload.id || payload.tag || `push-${createdAt}`;
      const transaction = db.transaction(NOTIFICATION_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(NOTIFICATION_STORE_NAME);
      const existingRequest = store.get(id);
      existingRequest.onsuccess = () => {
        const existing = existingRequest.result;
        store.put({
          ...existing,
          id,
          type: payload.type || 'push',
          title: payload.title || '오늘의 묵상',
          titleKo: payload.titleKo,
          titleZh: payload.titleZh,
          reference: payload.reference || '',
          referenceKo: payload.referenceKo,
          referenceZh: payload.referenceZh,
          text: payload.text || payload.body || '',
          textKo: payload.textKo,
          textZh: payload.textZh,
          createdAt,
          expiresAt: createdAt + NOTIFICATION_RETENTION_MS,
          readAt: existing?.readAt || null
        });
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    };
  });
}
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data?.json() || {}; } catch (error) { payload = { body: event.data?.text() || '' }; }
  event.waitUntil(Promise.all([
    savePushNotification(payload),
    self.registration.showNotification(payload.title || '오늘의 묵상', {
      body: payload.body || payload.text || '',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32-2.png',
      tag: payload.tag || payload.id || 'daily-meditation',
      data: { url: payload.url || '/notifications' }
    })
  ]));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/notifications', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.startsWith(self.location.origin));
      if (existing) {
        existing.navigate(targetUrl);
        return existing.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});