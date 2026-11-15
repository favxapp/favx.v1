import { createSendEmailHandler, readEmailConfig } from '@/lib/email/send-hook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    return await createSendEmailHandler(readEmailConfig(process.env))(request);
  } catch {
    console.error('auth_email_configuration_missing');
    return Response.json({ error: { http_code: 500, message: 'Email configuration unavailable' } }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
