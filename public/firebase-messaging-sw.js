/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js"
);

self.addEventListener("install", async () => {
  try {
    const response = await fetch("/api/get_firebase_config");
    const firebaseConfig = await response.json();

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
      console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
      );
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: './favicon.ico',
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (e) {
    console.error(e);
  }
});

// Handle notification click event.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickActionUrl = event.notification.data?.click_action

  if (!clickActionUrl)
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // If a tab is already open with the URL, focus on it
        for (let client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        // If no matching tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  else {
    event.waitUntil(
      clients.openWindow(clickActionUrl)
    )
  }
});