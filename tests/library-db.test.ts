import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("private library: idempotent saves, isolation, collections, order, revocation and unavailable posts", async () => {
  const db = new PGlite();
  const a = "11111111-1111-4111-8111-111111111111",
    b = "22222222-2222-4222-8222-222222222222",
    c = "33333333-3333-4333-8333-333333333333";
  const post1 = "44444444-4444-4444-8444-444444444444",
    post2 = "55555555-5555-4555-8555-555555555555",
    collection = "66666666-6666-4666-8666-666666666666";
  const role = async (name: string, user = "") => {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      user,
    ]);
    await db.exec(`set role ${name}`);
  };
  const payload = {
    title: "Café favorito",
    body: "Uma pausa no parque",
    slug: "cafe",
    content_kind: "place",
    tags: ["pausa"],
    categories: ["Cafés"],
    links: [],
    rating: null,
    is_sponsored: false,
    disclosure: "",
    private_context: "NEVER_PUBLIC_CONTEXT",
  };
  const library = async (query = "") =>
    (
      await db.query<{
        result: {
          items: { id: string; post: Record<string, unknown> | null }[];
          total: number;
        };
      }>("select public.get_user_library($1) result", [query])
    ).rows[0].result;
  const shared = async (token: string) =>
    (
      await db.query<{
        result: { posts: { public_id: string }[]; title: string } | null;
      }>("select public.get_shared_user_collection($1) result", [token])
    ).rows[0].result;
  try {
    await db.exec(
      `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`,
    );
    for (const f of [
      "migrations/20261109000100_foundation_auth_creator.sql",
      "migrations/20261115155702_creator_public_profile.sql",
      "migrations/20261115221433_creator_posts.sql",
      "migrations/20261120220440_workspace_collections_search_ai_media.sql",
      "migrations/20261121165355_user_library.sql",
    ])
      await db.exec(
        await readFile(new URL(`../supabase/${f}`, import.meta.url), "utf8"),
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
    await db.exec("update public.creator_profiles set is_public=true");
    const public1 = (
      await db.query<{ public_id: string }>(
        "select * from public.save_creator_post($1,0,$2,'published')",
        [post1, JSON.stringify(payload)],
      )
    ).rows[0].public_id;
    const public2 = (
      await db.query<{ public_id: string }>(
        "select * from public.save_creator_post($1,0,$2,'published')",
        [post2, JSON.stringify({ ...payload, title: "Outro café" })],
      )
    ).rows[0].public_id;
    await role("authenticated", b);
    const save = async (id: string) =>
      (
        await db.query<{ id: string }>(
          "select public.save_recommendation($1) id",
          [id],
        )
      ).rows[0].id;
    const s1 = await save(public1),
      s2 = await save(public2);
    assert.equal(await save(public1), s1);
    assert.equal((await library()).total, 2);
    assert.equal((await library("parque")).total, 2);
    assert.equal((await library("NEVER_PUBLIC_CONTEXT")).total, 0);
    await db.query(
      "select * from public.save_user_collection($1,0,$2,$3,$4,$5)",
      [collection, "Minhas pausas", "Somente esta seleção", [s2, s1], s2],
    );
    let row = (
      await db.query<{ share_enabled: boolean; share_token: string | null }>(
        "select share_enabled,share_token from public.user_collections",
      )
    ).rows[0];
    assert.equal(row.share_enabled, false);
    assert.equal(row.share_token, null);
    const ordered = (
      await db.query<{ r: { items: { id: string }[] } }>(
        "select public.get_user_library(p_collection:=$1) r",
        [collection],
      )
    ).rows[0].r;
    assert.deepEqual(
      ordered.items.map((x) => x.id),
      [s2, s1],
    );
    await assert.rejects(
      db.query("select * from public.save_user_collection($1,1,$2,$3,$4)", [
        collection,
        "Bad",
        "",
        [s1, s1],
      ]),
      /INVALID_ITEMS/,
    );
    await assert.rejects(
      db.query("select * from public.save_user_collection($1,99,$2,$3,$4)", [
        collection,
        "Bad",
        "",
        [],
      ]),
      /COLLECTION_CONFLICT/,
    );
    await assert.rejects(
      db.query("update public.user_collections set share_token='attacker'"),
      /permission denied/,
    );
    const token = (
      await db.query<{ share_token: string }>(
        "select * from public.share_user_collection($1,1,true)",
        [collection],
      )
    ).rows[0].share_token;
    await role("anon");
    await assert.rejects(db.query("select * from public.user_saves"));
    await assert.rejects(db.query("select public.get_user_library()"));
    await assert.rejects(db.query("select * from public.user_collections"));
    const publicView = await shared(token);
    assert.deepEqual(
      publicView?.posts.map((x) => x.public_id),
      [public2, public1],
    );
    assert.ok(!JSON.stringify(publicView).includes(b));
    assert.ok(!JSON.stringify(publicView).includes(s1));
    assert.ok(!JSON.stringify(publicView).includes("NEVER_PUBLIC_CONTEXT"));
    assert.equal(await shared("invalid"), null);
    await role("authenticated", c);
    assert.equal((await library()).total, 0);
    assert.equal(
      (await db.query("select * from public.user_collections")).rows.length,
      0,
    );
    await assert.rejects(
      db.query("select * from public.share_user_collection($1,2,false)", [
        collection,
      ]),
      /COLLECTION_CONFLICT/,
    );
    await assert.rejects(
      db.query("select * from public.save_user_collection($1,0,$2,$3,$4)", [
        c,
        "Foreign",
        "",
        [s1],
      ]),
      /INVALID_ITEMS/,
    );
    await role("authenticated", b);
    await db.query("select * from public.share_user_collection($1,2,false)", [
      collection,
    ]);
    await role("anon");
    assert.equal(await shared(token), null);
    await role("authenticated", b);
    const newToken = (
      await db.query<{ share_token: string }>(
        "select * from public.share_user_collection($1,3,true)",
        [collection],
      )
    ).rows[0].share_token;
    assert.notEqual(newToken, token);
    await role("authenticated", a);
    await db.query("select * from public.save_creator_post($1,1,$2,'hidden')", [
      post1,
      JSON.stringify(payload),
    ]);
    await role("authenticated", b);
    assert.equal((await library()).items.find((x) => x.id === s1)?.post, null);
    assert.equal((await library("Café favorito")).total, 0);
    await role("anon");
    assert.deepEqual(
      (await shared(newToken))?.posts.map((x) => x.public_id),
      [public2],
    );
    assert.equal(await shared(token), null);
    await role("authenticated", b);
    await db.query("delete from public.user_saves where id=$1", [s2]);
    const reduced = (
      await db.query<{
        saved_ids: string[];
        cover_saved_id: string | null;
        version: number;
      }>("select saved_ids,cover_saved_id,version from public.user_collections")
    ).rows[0];
    assert.deepEqual(reduced.saved_ids, [s1]);
    assert.equal(reduced.cover_saved_id, null);
    assert.equal(reduced.version, 5);
    await role("anon");
    assert.equal((await shared(newToken))?.posts.length, 0);
    await role("postgres");
    assert.equal(
      (await db.query("select * from public.creator_posts")).rows.length,
      2,
    );
    await db.query(
      "update public.profiles set account_state='suspended' where user_id=$1",
      [b],
    );
    await role("authenticated", b);
    assert.equal((await library()).total, 0);
    await assert.rejects(
      db.query("select public.save_recommendation($1)", [public2]),
      /UNAUTHORIZED/,
    );
    await role("anon");
    assert.equal(await shared(newToken), null);
  } finally {
    await db.close();
  }
});
