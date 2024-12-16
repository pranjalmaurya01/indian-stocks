import FIREBASE_CONFIG from '@/app/firebase/config';

export async function GET() {
  return Response.json(FIREBASE_CONFIG);
}
