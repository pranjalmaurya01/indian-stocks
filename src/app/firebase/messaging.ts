import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import FIREBASE_CONFIG from './config';

export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export const getFCMToken = async () => {
  const app = initializeApp(FIREBASE_CONFIG);
  const messaging = getMessaging(app);
  try {
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });
    return token;
  } catch (e) {
    console.log('getFCMToken error', e);
    return;
  }
};

const requestPermission = async () => {
  const notiStatus = await Notification.requestPermission();
  switch (notiStatus) {
    case 'granted': {
      return { error: false, token: getFCMToken() };
    }
    case 'denied': {
      console.log('denied');
      return { error: true, token: null };
    }
  }
};

const onMessageListener = () =>
  new Promise((resolve) => {
    const app = initializeApp(FIREBASE_CONFIG);
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      resolve(payload);
      console.log(payload);
    });
  });

export { onMessageListener, requestPermission };
