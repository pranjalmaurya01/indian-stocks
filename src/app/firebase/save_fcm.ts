'use server';
import { NOTI_TOPIC } from '@/constants';
import { getMessaging } from 'firebase-admin/messaging';
import initializeFirebaseAdminApp from './admin';

export async function saveFcm({ fcm }: { fcm: string }) {
  try {
    await initializeFirebaseAdminApp();
    const registrationTokens = [fcm];
    console.log(fcm);

    const resp = await getMessaging().subscribeToTopic(
      registrationTokens,
      NOTI_TOPIC
    );

    return resp;
  } catch (e) {
    console.error(e);
    return null;
  }
}
