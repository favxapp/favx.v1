import type { Locale } from '../locale.ts';
import { EMAIL_MESSAGES } from './messages.ts';

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
export function httpsOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('Invalid APP_URL');
  return url.origin;
}
export function emailAddress(value: string): boolean {
  return value.length <= 254 && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(value);
}
export type EmailBrand = { appUrl: string; supportEmail: string; logoUrl?: string };
export function renderOtpEmail(locale: Locale, token: string, brand: EmailBrand) {
  if (!/^\d{6,10}$/.test(token)) throw new Error('Invalid OTP');
  const origin = httpsOrigin(brand.appUrl);
  if (!emailAddress(brand.supportEmail)) throw new Error('Invalid support email');
  if (brand.logoUrl) {
    const url = new URL(brand.logoUrl);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid logo URL');
  }
  const m = EMAIL_MESSAGES[locale];
  const appLink = `${origin}/${locale}`;
  const supportLink = `mailto:${brand.supportEmail}`;
  const e = escapeHtml;
  // Static values from DOC04: email clients do not reliably support CSS variables or web fonts.
  const logo = brand.logoUrl
    ? `<img src="${e(brand.logoUrl)}" alt="FAVX" width="112" style="display:block;width:112px;max-width:100%;height:auto;border:0;" />`
    : '<span style="font-family:Georgia,serif;font-size:36px;letter-spacing:-2px;color:#151515;">FAVX</span>';
  const html = `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(m.subject)}</title></head>
<body style="margin:0;padding:0;background:#FCFBFA;color:#242424;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${e(m.subject)} · ${e(m.footer)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FCFBFA;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #DEDDDA;border-radius:24px;"><tr><td style="padding:32px 24px;">
<a href="${e(appLink)}" style="text-decoration:none;">${logo}</a>
<h1 style="margin:32px 0 16px;font-family:Georgia,serif;font-size:32px;line-height:1.2;font-weight:400;color:#151515;">${e(m.title)}</h1>
<p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#595959;">${e(m.intro)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F4;border:1px solid #DEDDDA;border-radius:14px;"><tr><td align="center" style="padding:24px 8px;">
<p style="margin:0 0 12px;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#595959;">${e(m.code)}</p>
<p style="margin:0;font-family:Consolas,Monaco,monospace;font-size:28px;line-height:1.5;font-weight:bold;letter-spacing:2px;color:#151515;">${token}</p>
</td></tr></table>
<p style="margin:16px 0;font-size:13px;line-height:1.6;color:#595959;">${e(m.expiry)}</p>
<p style="margin:0 0 28px;font-size:13px;line-height:1.6;color:#595959;">${e(m.security)}</p>
<div style="border-top:1px solid #EBEAE8;padding-top:24px;">
<p style="margin:0 0 16px;font-size:16px;color:#151515;">${e(m.help)}</p>
<a href="${e(supportLink)}" style="display:inline-block;padding:14px 20px;background:#181818;border:1px solid #181818;border-radius:14px;color:#FFFFFF;font-size:14px;font-weight:bold;text-decoration:none;">${e(m.support)}</a>
<p style="margin:16px 0 0;font-size:13px;"><a href="${e(appLink)}" style="color:#2356B2;text-decoration:underline;">${e(m.visit)}</a></p>
</div></td></tr></table>
<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#676767;">FAVX · ${e(m.footer)}</p>
</td></tr></table></body></html>`;
  const text = [`FAVX — ${m.title}`, m.intro, `${m.code}: ${token}`, m.expiry, m.security, `${m.support}: ${brand.supportEmail}`, `${m.visit}: ${appLink}`, m.footer].join('\n\n');
  return { subject: m.subject, html, text };
}
