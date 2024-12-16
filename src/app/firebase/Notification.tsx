'use client';

import { registerServiceWorker } from '@/utils';
import { useEffect } from 'react';
import { onMessageListener, requestPermission } from './messaging';

const Notification = () => {
  useEffect(() => {
    let unsubscribe: any;
    (async () => {
      if (typeof window !== 'undefined') {
        await registerServiceWorker();

        const permission = await requestPermission();
        if (!permission || permission.error) return;

        const token = await permission.token;

        if (token) {
          console.log(token);
        }
        // await request(
        //   'POST',
        //   'notification/fcm_operations/',
        //   {},
        //   { fcm: token }
        // );

        unsubscribe = onMessageListener().then((payload: any) => {
          console.log({ notification_payload: payload });
          // notification.info({
          //   message: payload.notification.title,
          //   description: payload.notification.body,
          //   duration: 8,
          //   placement: 'topRight',
          // });
        });
      }
    })();
    return () => {
      if (unsubscribe)
        unsubscribe.catch((err: any) => console.log('failed : ', err));
    };
  }, []);
  return null;
};

export default Notification;
