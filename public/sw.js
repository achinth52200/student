// StudentSync Service Worker — Push Notifications for Reminders

const SW_VERSION = '1.0.0';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle notification click — focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If the app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('/reminders') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open the reminders page
      if (self.clients.openWindow) {
        return self.clients.openWindow('/reminders');
      }
    })
  );
});

// Listen for messages from the app to show notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, data } = event.data;
    self.registration.showNotification(title, {
      body,
      tag,
      icon: '/logo.svg',
      badge: '/logo.svg',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data,
      actions: [
        { action: 'view', title: '📋 View' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    });
  }

  if (event.data && event.data.type === 'SCHEDULE_REMINDERS') {
    // Store reminders for periodic check
    self.remindersData = event.data.reminders;
  }
});
