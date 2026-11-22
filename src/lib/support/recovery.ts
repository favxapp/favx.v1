/** Only the framework's opaque correlation token may be displayed, never its error text. */
export function safeErrorReference(value: unknown): string | null {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(value)
    ? value
    : null;
}
