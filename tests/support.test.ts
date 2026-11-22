import test from "node:test";
import assert from "node:assert/strict";
import { parseSupportDraft, supportEmail } from "../src/lib/support/message.ts";
import { safeErrorReference } from "../src/lib/support/recovery.ts";

test("support preparation requires deliberate consent and safely encodes text into email body", () => {
  const input = {
    subject: "Foto & imagem #1",
    category: "media",
    description:
      "A foto não apareceu depois de selecionar o arquivo.\nSegunda linha: ?cc=not-an-address",
    consent: true,
  };
  const draft = parseSupportDraft(input);
  assert.ok(draft);
  const { href, text } = supportEmail(draft, "Imagens e arquivos");
  const parsed = new URL(href);
  assert.equal(parsed.protocol, "mailto:");
  assert.equal(parsed.pathname, "suporte@favx.app");
  assert.deepEqual([...parsed.searchParams.keys()], ["subject", "body"]);
  assert.equal(parsed.searchParams.get("body"), input.description);
  assert.match(text, /Foto & imagem #1/);
  for (const invalid of [
    { consent: false },
    { subject: "bad\r\nbcc:someone" },
    { description: "too short" },
    { description: "x".repeat(3001) },
    { category: "unknown" },
    { subject: "   " },
  ])
    assert.equal(parseSupportDraft({ ...input, ...invalid }), null);
  assert.equal(parseSupportDraft(null), null);
});
test("error recovery only displays a bounded opaque reference, never stack traces, paths or objects", () => {
  assert.equal(safeErrorReference("1234567890"), "1234567890");
  for (const value of [
    null,
    undefined,
    new Error("private"),
    "/app/private/1",
    "secret@example.test",
    "Error: SQL failed",
    "<script>",
    "x".repeat(65),
  ])
    assert.equal(safeErrorReference(value), null);
});
