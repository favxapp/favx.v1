import { mkdir, writeFile } from 'node:fs/promises';
import { LOCALES } from '../src/lib/locale.ts';
import { renderOtpEmail } from '../src/lib/email/template.ts';

const directory = new URL('../docs/email/previews/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const locale of LOCALES) {
  // Static demonstration only: no provider request, credentials or real OTP.
  const email = renderOtpEmail(locale, '123456', { appUrl: 'https://favx-v1.vercel.app', supportEmail: 'suporte@favx.app' });
  await writeFile(new URL(`${locale}.html`, directory), email.html);
}
console.log('Six static email previews generated in docs/email/previews (sample code only).');
