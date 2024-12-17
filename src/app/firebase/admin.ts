'use server';

import { apps, credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

export default async function initializeFirebaseAdminApp() {
  const FIREBASE_ADMIN_CONFIG = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG!);

  // Check if the app is already initialized
  if (!apps.length) {
    initializeApp({
      credential: credential.cert(FIREBASE_ADMIN_CONFIG),
    });
  }
}
