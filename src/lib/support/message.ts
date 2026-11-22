export const SUPPORT_EMAIL = "suporte@favx.app";
export const SUPPORT_CATEGORIES = [
  "technical",
  "account",
  "media",
  "feedback",
  "other",
] as const;
export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];
export type SupportDraft = {
  subject: string;
  category: SupportCategory;
  description: string;
  consent: true;
};

export function parseSupportDraft(input: unknown): SupportDraft | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Record<string, unknown>;
  if (
    typeof value.subject !== "string" ||
    typeof value.description !== "string" ||
    typeof value.category !== "string" ||
    value.consent !== true
  )
    return null;
  const subject = value.subject.trim(),
    description = value.description.trim();
  if (
    !subject ||
    subject.length > 100 ||
    /[\r\n\u0000-\u001f\u007f]/.test(subject) ||
    description.length < 20 ||
    description.length > 3000 ||
    description.includes("\0") ||
    !(SUPPORT_CATEGORIES as readonly string[]).includes(value.category)
  )
    return null;
  return {
    subject,
    description,
    category: value.category as SupportCategory,
    consent: true,
  };
}

export function supportEmail(draft: SupportDraft, categoryLabel: string) {
  const subject = `[FAVX · ${categoryLabel}] ${draft.subject}`;
  const body = draft.description;
  return {
    href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    text: `${SUPPORT_EMAIL}\n${subject}\n\n${body}`,
  };
}
