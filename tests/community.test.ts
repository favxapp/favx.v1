import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import {
  parseRequest,
  parseSuggestion,
  EMPTY_REQUEST,
} from "../src/lib/community/model.ts";
test("community input rejects unsupported states, invalid dates, missing consent and unsafe URLs", () => {
  assert.equal(
    parseRequest({ ...EMPTY_REQUEST, title: "Question", state: "published" }),
    null,
  );
  assert.equal(
    parseRequest({
      ...EMPTY_REQUEST,
      title: "Question",
      expires_at: "not-a-date",
    }),
    null,
  );
  assert.equal(parseRequest({ ...EMPTY_REQUEST, title: " " }), null);
  assert.equal(
    parseRequest({ ...EMPTY_REQUEST, title: "Question" })?.title,
    "Question",
  );
  const input = {
    title: "A book",
    description: "A useful guide",
    category: "Books",
    url: "https://example.com/book",
    consent: true,
  };
  assert.ok(parseSuggestion(input));
  for (const url of [
    "javascript:alert(1)",
    "https://user@evil.test",
    "http://example.com",
    "https://example.com:8443",
    "https://example.com\\@evil.test",
  ])
    assert.equal(parseSuggestion({ ...input, url }), null);
  assert.equal(parseSuggestion({ ...input, consent: false }), null);
  assert.equal(
    parseSuggestion({ ...input, description: "x".repeat(4001) }),
    null,
  );
});
test("community SQL: private intake, idempotency, rate limit, review conflicts, closure and ownership", async () => {
  const db = new PGlite(),
    a = "11111111-1111-4111-8111-111111111111",
    b = "22222222-2222-4222-8222-222222222222",
    c = "33333333-3333-4333-8333-333333333333",
    request = "44444444-4444-4444-8444-444444444444",
    submission = "55555555-5555-4555-8555-555555555555";
  const role = async (r: string, id = "") => {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
    await db.exec(`set role ${r}`);
  };
  const payload = {
    ...EMPTY_REQUEST,
    title: "What should I read?",
    description: "Public request",
    state: "open",
  };
  const suggestion = {
    title: "PRIVATE_REPLY",
    description: "PRIVATE_DESCRIPTION",
    category: "Books",
    url: "https://example.com",
    consent: true,
  };
  const send = (id = submission, input = suggestion) =>
    db.query<{ id: string }>("select public.submit_community_suggestion($1,$2,$3) id", [
      id,
      request,
      JSON.stringify(input),
    ]);
  const publicView = async () =>
    (
      await db.query<{ r: Record<string, unknown> | null }>(
        "select public.get_community_request($1) r",
        [request],
      )
    ).rows[0].r;
  try {
    await db.exec(
      `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`,
    );
    const files = (
      await readdir(new URL("../supabase/migrations/", import.meta.url))
    )
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const f of files)
      await db.exec(
        await readFile(
          new URL("../supabase/migrations/" + f, import.meta.url),
          "utf8",
        ),
      );
    if (!files.some((f) => f.endsWith("_community_requests.sql")))
      await db.exec(
        await readFile(
          new URL(
            "../supabase/proposals/community_requests.sql",
            import.meta.url,
          ),
          "utf8",
        ),
      );
    await db.query("insert into auth.users(id) values($1),($2),($3)", [
      a,
      b,
      c,
    ]);
    await role("authenticated", a);
    await db.query(
      "insert into public.creator_profiles(user_id,username,display_name) values($1,'alice','Alice')",
      [a],
    );
    await assert.rejects(
      db.query("select * from public.save_community_request($1,0,$2)", [
        request,
        JSON.stringify(payload),
      ]),
      /REQUEST_NOT_READY/,
    );
    await db.exec("update public.creator_profiles set is_public=true");
    await db.query("select * from public.save_community_request($1,0,$2)", [
      request,
      JSON.stringify({ ...payload, state: "draft" }),
    ]);
    await role("anon");
    assert.equal(await publicView(), null);
    await assert.rejects(send());
    await role("authenticated", a);
    await db.query("select * from public.save_community_request($1,1,$2)", [
      request,
      JSON.stringify(payload),
    ]);
    await assert.rejects(
      db.query("select * from public.save_community_request($1,1,$2)", [
        request,
        JSON.stringify(payload),
      ]),
      /REQUEST_CONFLICT/,
    );
    await role("authenticated", b);
    await assert.rejects(
      send(submission, { ...suggestion, consent: false }),
      /CONSENT_REQUIRED/,
    );
    assert.equal((await send()).rows[0].id, submission);
    assert.equal((await send()).rows[0].id, submission);
    assert.equal(
      (await db.query("select id,title from public.community_submissions")).rows
        .length,
      0,
    );
    await assert.rejects(
      db.query("select sender_id from public.community_submissions"),
    );
    await assert.rejects(
      send(submission, { ...suggestion, title: "Changed retry" }),
      /SUBMISSION_CONFLICT/,
    );
    for (let i = 1; i < 5; i++)
      await send(`66666666-6666-4666-8666-${String(i).padStart(12, "0")}`);
    await assert.rejects(
      send("66666666-6666-4666-8666-000000000006"),
      /RATE_LIMIT/,
    );
    assert.equal((await send()).rows[0].id, submission);
    await role("authenticated", c);
    assert.equal(
      (
        await db.query<{ r: { total: number } }>(
          "select public.get_community_inbox() r",
        )
      ).rows[0].r.total,
      0,
    );
    await assert.rejects(send(), /SUBMISSION_CONFLICT/);
    assert.equal(
      (
        await db.query(
          "update public.community_submissions set review_state='selected' where id=$1 returning id",
          [submission],
        )
      ).rows.length,
      0,
    );
    await role("anon");
    await assert.rejects(
      db.query("select title from public.community_submissions"),
    );
    const pub = JSON.stringify(await publicView());
    assert.ok(
      !pub.includes("PRIVATE_REPLY") &&
        !pub.includes(b) &&
        !pub.includes("received") &&
        !pub.includes(a),
    );
    await role("authenticated", a);
    const inbox = (
      await db.query<{
        r: { total: number; items: Record<string, unknown>[] };
      }>("select public.get_community_inbox() r")
    ).rows[0].r;
    assert.equal(inbox.total, 5);
    assert.ok(inbox.items.some((s) => s.title === "PRIVATE_REPLY"));
    assert.ok(!JSON.stringify(inbox).includes(b));
    assert.equal(
      (
        await db.query<{ version: number }>(
          "update public.community_submissions set review_state='selected' where id=$1 and version=1 returning version",
          [submission],
        )
      ).rows[0].version,
      2,
    );
    assert.equal(
      (
        await db.query(
          "update public.community_submissions set review_state='rejected' where id=$1 and version=1 returning id",
          [submission],
        )
      ).rows.length,
      0,
    );
    await assert.rejects(
      db.query(
        "update public.community_submissions set description='Fake endorsement' where id=$1",
        [submission],
      ),
    );
    assert.equal(
      (await db.query("select id from public.creator_posts")).rows.length,
      0,
    );
    await db.query("select * from public.save_community_request($1,2,$2)", [
      request,
      JSON.stringify({ ...payload, state: "closed" }),
    ]);
    await role("anon");
    assert.equal(await publicView(), null);
    await role("authenticated", c);
    await assert.rejects(
      send("66666666-6666-4666-8666-000000000007"),
      /REQUEST_CLOSED/,
    );
    await role("authenticated", a);
    assert.equal(
      (
        await db.query<{ r: { total: number } }>(
          "select public.get_community_inbox() r",
        )
      ).rows[0].r.total,
      5,
    );
    await db.query("select * from public.save_community_request($1,3,$2)", [
      request,
      JSON.stringify({ ...payload, expires_at: "2099-01-01T00:00:00Z" }),
    ]);
    await db
      .exec(
        "alter table public.community_requests disable trigger community_request_validate",
      )
      .then(
        () => assert.fail("owner changed trigger"),
        () => {},
      );
    await role("postgres");
    await db.exec(
      "alter table public.community_requests disable trigger community_request_validate",
    );
    await db.query(
      "update public.community_requests set expires_at=now()-interval '1 second' where id=$1",
      [request],
    );
    await db.exec(
      "alter table public.community_requests enable trigger community_request_validate",
    );
    await role("anon");
    assert.equal(await publicView(), null);
    await role("authenticated", c);
    await assert.rejects(
      send("66666666-6666-4666-8666-000000000008"),
      /REQUEST_CLOSED/,
    );
    await role("postgres");
    await db.query(
      "update public.profiles set account_state='suspended' where user_id=$1",
      [a],
    );
    await role("authenticated", a);
    assert.equal(
      (
        await db.query<{ r: { total: number } }>(
          "select public.get_community_inbox() r",
        )
      ).rows[0].r.total,
      0,
    );
    assert.equal(
      (await db.query("select id from public.community_requests")).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
