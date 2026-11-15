import { httpsOrigin } from '../email/template.ts';

export function publicOrigin() {
  return httpsOrigin(process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://favx-v1.vercel.app'));
}
