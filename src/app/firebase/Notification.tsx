'use client';

import { registerServiceWorker } from '@/utils';
import { useEffect } from 'react';
import { onMessageListener, requestPermission } from './messaging';
import { saveFcm } from './save_fcm';

const NotificationComp = () => {
  useEffect(() => {
    let unsubscribe: any;
    (async () => {
      if (typeof window !== 'undefined') {
        await registerServiceWorker();

        const permission = await requestPermission();
        if (!permission || permission.error) return;

        const token = await permission.token;

        if (token) {
          await saveFcm({ fcm: token });
        }
      }
      unsubscribe = onMessageListener().then((payload: any) => {
        console.log({ notification_payload: payload });
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: './favicon.ico',
        };
        const notification = new Notification(
          notificationTitle,
          notificationOptions
        );
      });
    })();
    return () => {
      if (unsubscribe)
        unsubscribe.catch((err: any) => console.log('failed : ', err));
    };
  }, []);
  return null;
};

export default NotificationComp;
