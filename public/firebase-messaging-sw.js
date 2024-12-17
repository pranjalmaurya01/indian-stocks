/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
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
