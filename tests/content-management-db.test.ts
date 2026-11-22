import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("content management: reversible transitions, immutable history, media ownership and public revocation", async () => {
  const db = new PGlite();
  const a = "11111111-1111-4111-8111-111111111111",
    b = "22222222-2222-4222-8222-222222222222",
    post = "33333333-3333-4333-8333-333333333333",
    media = "44444444-4444-4444-8444-444444444444";
  const role = async (r: string, id = "") => {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
    await db.exec(`set role ${r}`);
  };
  const change = async (version: number, action: string) =>
    (
      await db.query<{ version: number; lifecycle_state: string }>(
        "select * from public.transition_creator_post($1,$2,$3)",
        [post, version, action],
      )
    ).rows[0];
  const payload = {
    title: "Original title",
    body: "Original body",
    slug: "original",
    content_kind: "recommendation",
    tags: ["one"],
    categories: [],
    links: [],
    rating: null,
    is_sponsored: false,
    disclosure: "",
    private_context: "PRIVATE_CONTEXT",
    media_ids: [media],
  };
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
    if (!files.some((f) => f.endsWith("_creator_content_management.sql")))
      await db.exec(
        await readFile(
          new URL(
            "../supabase/proposals/creator_content_management.sql",
            import.meta.url,
          ),
          "utf8",
        ),
      );
    await db.query("insert into auth.users(id) values($1),($2)", [a, b]);
    await role("authenticated", a);
    await db.query(
      "insert into public.creator_profiles(user_id,username,display_name) values($1,'alice','Alice')",
      [a],
    );
    await db.exec("update public.creator_profiles set is_public=true");
    await db.query(
      "insert into public.creator_media(id,creator_id,filename,mime,byte_size) values($1,$2,'Photo.png','image/png',1024)",
      [media, a],
    );
    await db.query(
      "update public.creator_media set status='ready' where id=$1",
      [media],
    );
    const saved = (
      await db.query<{ public_id: string }>(
        "select * from public.save_creator_post($1,0,$2,$3)",
        [post, JSON.stringify(payload), "published"],
      )
    ).rows[0];
    assert.equal((await change(1, "archive")).lifecycle_state, "archived");
    await assert.rejects(change(1, "trash"), /POST_CONFLICT/);
    await assert.rejects(
      db.query(
        "update public.creator_posts set lifecycle_state='published' where id=$1",
        [post],
      ),
      /RESTORE_AS_DRAFT/,
    );
    await assert.rejects(
      db.query("select * from public.save_creator_post($1,2,$2,'draft')", [
        post,
        JSON.stringify({ ...payload, title: "Bypass restoration" }),
      ]),
      /RESTORE_AS_DRAFT/,
    );
    await assert.rejects(db.query("delete from favx_private.post_revisions"));
    await assert.rejects(
      db.query("update favx_private.post_revisions set snapshot='{}'"),
    );
    const history = (
      await db.query<{ snapshot: Record<string, unknown> }>(
        "select * from public.get_creator_post_history($1)",
        [post],
      )
    ).rows;
    assert.equal(history.length, 2);
    assert.equal(history[1].snapshot.title, "Original title");
    assert.equal(history[0].snapshot.lifecycle_state, "archived");
    assert.ok(!("creator_id" in history[0].snapshot));
    const inventory = (
      await db.query<{ j: { total: number; items: { id: string }[] } }>(
        "select public.get_creator_media_library() j",
      )
    ).rows[0].j;
    assert.equal(inventory.total, 1);
    assert.equal(inventory.items[0].id, media);
    await role("authenticated", b);
    assert.equal(
      (
        await db.query("select * from public.get_creator_post_history($1)", [
          post,
        ])
      ).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from favx_private.post_revisions")).rows.length,
      0,
    );
    await assert.rejects(change(2, "restore"), /POST_CONFLICT/);
    assert.equal(
      (
        await db.query<{ j: { total: number } }>(
          "select public.get_creator_media_library() j",
        )
      ).rows[0].j.total,
      0,
    );
    await role("anon");
    await assert.rejects(
      db.query("select * from public.get_creator_post_history($1)", [post]),
    );
    await assert.rejects(db.query("select public.get_creator_media_library()"));
    await assert.rejects(change(2, "restore"));
    assert.equal(
      (
        await db.query("select * from public.get_public_posts('alice',$1)", [
          saved.public_id,
        ])
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query<{ b: boolean }>("select public.can_view_media($1) b", [
          media,
        ])
      ).rows[0].b,
      false,
    );
    await role("authenticated", a);
    assert.equal((await change(2, "trash")).lifecycle_state, "trashed");
    assert.equal((await change(3, "restore")).lifecycle_state, "draft");
    assert.equal(
      (
        await db.query<{ public_id: string; title: string }>(
          "select public_id,title from public.creator_posts where id=$1",
          [post],
        )
      ).rows[0].public_id,
      saved.public_id,
    );
    await role("anon");
    assert.equal(
      (await db.query("select * from public.get_public_posts('alice')")).rows
        .length,
      0,
    );
    await role("authenticated", a);
    await db.query(
      "select * from public.save_creator_post($1,4,$2,'published')",
      [post, JSON.stringify({ ...payload, title: "Reviewed" })],
    );
    await role("anon");
    assert.equal(
      (await db.query("select * from public.get_public_posts('alice')")).rows
        .length,
      1,
    );
    await role("postgres");
    await db.query(
      "update public.profiles set account_state='suspended' where user_id=$1",
      [a],
    );
    await role("authenticated", a);
    assert.equal(
      (
        await db.query("select * from public.get_creator_post_history($1)", [
          post,
        ])
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query<{ j: { total: number } }>(
          "select public.get_creator_media_library() j",
        )
      ).rows[0].j.total,
      0,
    );
    await assert.rejects(change(5, "trash"), /POST_CONFLICT/);
  } finally {
    await db.close();
  }
});
