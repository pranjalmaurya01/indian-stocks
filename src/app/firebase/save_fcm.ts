'use server';
import { getMessaging } from 'firebase-admin/messaging';
import initializeFirebaseAdminApp from './admin';

const topic = 'stocks-noti';

export async function saveFcm({ fcm }: { fcm: string }) {
  try {
    await initializeFirebaseAdminApp();
    const registrationTokens = [fcm];
    console.log(fcm);

    const resp = await getMessaging().subscribeToTopic(
      registrationTokens,
      topic
    );

    return resp;
  } catch (e) {
    console.error(e);
    return null;
  }
}
