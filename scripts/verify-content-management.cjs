const http = require("node:http"),
  fs = require("node:fs"),
  assert = require("node:assert/strict"),
  { spawn } = require("node:child_process");
const { PGlite } = require("@electric-sql/pglite");
const { chromium } = require("playwright-core");
const sharp = require("sharp");
const path = require("node:path"),
  os = require("node:os");
const root = path.resolve(__dirname, ".."),
  out =
    process.env.FAVX_TEST_OUTPUT ||
    fs.mkdtempSync(path.join(os.tmpdir(), "favx-management-"));
fs.mkdirSync(out, { recursive: true });
console.log("Browser verification artifacts:", out);
const a = "11111111-1111-4111-8111-111111111111",
  b = "22222222-2222-4222-8222-222222222222",
  c = "33333333-3333-4333-8333-333333333333";
const p1 = "44444444-4444-4444-8444-444444444444",
  p2 = "55555555-5555-4555-8555-555555555555",
  media = "77777777-7777-4777-8777-777777777777";
const db = new PGlite();
let tail = Promise.resolve(),
  failed = false;
function task(uid, fn) {
  const next = tail.then(async () => {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      uid ?? "",
    ]);
    await db.exec(
      uid === "admin"
        ? "reset role"
        : `set role ${uid ? "authenticated" : "anon"}`,
    );
    return fn();
  });
  tail = next.catch(() => {});
  return next;
}
const scalar = new Set([
  "get_creator_media_library",
  "get_post_media",
  "get_user_library",
  "get_shared_user_collection",
  "can_view_media",
  "save_recommendation",
  "browse_creator",
]);
const rpc = new Set([
  "get_creator_post_history",
  "transition_creator_post",
  "save_creator_post",
  ...scalar,
  "get_public_creator",
  "get_public_posts",
  "save_user_collection",
  "share_user_collection",
]);
let picture;
const api = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const chunks = [];
    for await (const x of req) chunks.push(x);
    const raw = Buffer.concat(chunks);
    const body = raw.length ? JSON.parse(raw.toString()) : {};
    let uid = null;
    try {
      const candidate = JSON.parse(
        Buffer.from(
          (req.headers.authorization ?? "").split(".")[1],
          "base64url",
        ),
      ).sub;
      if ([a, b, c].includes(candidate)) uid = candidate;
    } catch {}
    if (url.pathname.startsWith("/mock-storage/")) {
      res.writeHead(200, { "Content-Type": "image/webp" });
      res.end(picture);
      return;
    }
    if (url.pathname === "/auth/v1/user") {
      res.writeHead(uid ? 200 : 401, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify(
          uid
            ? {
                id: uid,
                email: "library-fixture@example.test",
                aud: "authenticated",
                role: "authenticated",
                app_metadata: { provider: "email" },
                user_metadata: {},
              }
            : { message: "No session" },
        ),
      );
      return;
    }
    const result = await task(uid, async () => {
      if (url.pathname.startsWith("/rest/v1/rpc/")) {
        const fn = url.pathname.split("/").at(-1);
        if (!rpc.has(fn)) throw Error("Unexpected RPC " + fn);
        const entries = Object.entries(body);
        for (const [k] of entries)
          if (!/^p_[a-z_]+$/.test(k)) throw Error("Invalid arg");
        const args = entries.map(([k], i) => `${k}:=$${i + 1}`).join(",");
        const q = scalar.has(fn)
          ? `select public.${fn}(${args}) as result`
          : `select * from public.${fn}(${args})`;
        const r = await db.query(
          q,
          entries.map(([, v]) => v),
        );
        return { data: scalar.has(fn) ? r.rows[0].result : r.rows };
      }
      const table = url.pathname.split("/").at(-1);
      if (
        ![
          "profiles",
          "creator_profiles",
          "user_saves",
          "user_collections",
          "creator_posts",
          "creator_collections",
          "creator_media",
        ].includes(table)
      )
        throw Error("Unexpected table " + table);
      const selection = url.searchParams.get("select") ?? "*";
      if (!/^(\*|[a-z_]+(,[a-z_]+)*)$/.test(selection))
        throw Error("Invalid selection");
      let values = [],
        where = [];
      for (const [key, value] of url.searchParams) {
        if (["select", "order", "limit", "offset"].includes(key)) continue;
        if (!/^[a-z_]+$/.test(key)) throw Error("Bad key");
        if (value.startsWith("eq.")) {
          values.push(value.slice(3));
          where.push(`${key}=$${values.length}`);
        } else if (value.startsWith("in.")) {
          values.push(value.slice(4, -1).split(","));
          where.push(`${key}=any($${values.length}::text[])`);
        } else if (value.startsWith("neq.")) {
          values.push(value.slice(4));
          where.push(`${key}<>$${values.length}`);
        } else if (value.startsWith("cs.")) {
          values.push(value.slice(3));
          where.push(`${key}@>$${values.length}::uuid[]`);
        } else if (value.startsWith("ilike.")) {
          values.push(value.slice(6));
          where.push(`${key} ilike $${values.length}`);
        } else throw Error("Unexpected filter " + value);
      }
      const clause = where.length ? " where " + where.join(" and ") : "";
      if (req.method === "DELETE") {
        const r = await db.query(
          `delete from public.${table}${clause} returning ${selection}`,
          values,
        );
        return { data: r.rows };
      }
      let order = url.searchParams.get("order");
      let orderSql = "";
      if (order) {
        orderSql =
          " order by " +
          order
            .split(",")
            .map((x) => {
              const [col, dir] = x.split(".");
              if (!/^[a-z_]+$/.test(col) || !["asc", "desc"].includes(dir))
                throw Error("Bad order");
              return col + " " + dir;
            })
            .join(",");
      }
      const count = (
        await db.query(
          `select count(*)::integer n from public.${table}${clause}`,
          values,
        )
      ).rows[0].n;
      const limit = Math.min(
          Number(url.searchParams.get("limit") ?? 1000),
          1000,
        ),
        offset = Number(url.searchParams.get("offset") ?? 0);
      const r = await db.query(
        `select ${selection} from public.${table}${clause}${orderSql} limit ${limit} offset ${offset}`,
        values,
      );
      return {
        data: req.headers.accept?.includes("vnd.pgrst.object")
          ? (r.rows[0] ?? null)
          : r.rows,
        count,
      };
    });
    res.writeHead(200, {
      "Content-Type": "application/json",
      ...(result.count !== undefined
        ? {
            "Content-Range": `0-${Math.max(0, result.count - 1)}/${result.count}`,
          }
        : {}),
    });
    res.end(JSON.stringify(result.data));
  } catch (e) {
    if (!e.code) {
      failed = true;
      console.error(e.stack);
    }
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: e.message, code: e.code ?? "FIXTURE_ERROR" }),
    );
  }
});
async function auth(context, uid) {
  const token = [
    { alg: "HS256", typ: "JWT" },
    {
      sub: uid,
      exp: Math.floor(Date.now() / 1000) + 3600,
      aud: "authenticated",
      role: "authenticated",
    },
    "fake",
  ]
    .map((x, i) =>
      i < 2 ? Buffer.from(JSON.stringify(x)).toString("base64url") : x,
    )
    .join(".");
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      value:
        "base64-" +
        Buffer.from(
          JSON.stringify({
            access_token: token,
            refresh_token: "fake",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: "bearer",
            user: { id: uid },
          }),
        ).toString("base64url"),
      domain: "localhost",
      path: "/",
    },
  ]);
}
(async () => {
  await db.exec(
    `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`,
  );
  const migration = fs
    .readdirSync(root + "/supabase/migrations")
    .find((n) => n.endsWith("_user_library.sql"));
  for (const path of [
    "migrations/20261109000100_foundation_auth_creator.sql",
    "migrations/20261115155702_creator_public_profile.sql",
    "migrations/20261115221433_creator_posts.sql",
    "migrations/20261120220440_workspace_collections_search_ai_media.sql",
    migration ? "migrations/" + migration : "proposals/user_library.sql",
    (() => {
      const f = fs
        .readdirSync(root + "/supabase/migrations")
        .find((n) => n.endsWith("_creator_content_management.sql"));
      return f ? "migrations/" + f : "proposals/creator_content_management.sql";
    })(),
  ])
    await db.exec(fs.readFileSync(root + "/supabase/" + path, "utf8"));
  await db.query("insert into auth.users(id) values($1),($2),($3)", [a, b, c]);
  await task(a, () =>
    db.query(
      "insert into public.creator_profiles(user_id,username,display_name) values($1,'alice','Alice')",
      [a],
    ),
  );
  await task(a, () =>
    db.exec("update public.creator_profiles set is_public=true"),
  );
  await task(a, () =>
    db.query(
      "insert into public.creator_media(id,creator_id,filename,mime,byte_size) values($1,$2,'fixture.jpg','image/jpeg',1000)",
      [media, a],
    ),
  );
  await task(a, () =>
    db.query("update public.creator_media set status='ready' where id=$1", [
      media,
    ]),
  );
  await task(b, () =>
    db.query(
      "insert into public.creator_profiles(user_id,username,display_name) values($1,'bob','Bob')",
      [b],
    ),
  );
  const payload = {
    title: "Um café no parque",
    body: "Uma pausa perto das árvores.",
    slug: "cafe",
    content_kind: "place",
    tags: ["pausa"],
    categories: ["Cafés"],
    links: [],
    rating: null,
    is_sponsored: false,
    disclosure: "",
    media_ids: [media],
    private_context: "NEVER_PUBLIC_CONTEXT",
  };
  const pub1 = (
    await task(a, () =>
      db.query("select * from public.save_creator_post($1,0,$2,'published')", [
        p1,
        JSON.stringify(payload),
      ]),
    )
  ).rows[0].public_id;
  const pub2 = (
    await task(a, () =>
      db.query("select * from public.save_creator_post($1,0,$2,'published')", [
        p2,
        JSON.stringify({
          ...payload,
          title: "Passeio na cidade",
          slug: "cidade",
          media_ids: [],
        }),
      ]),
    )
  ).rows[0].public_id;
  picture = await sharp(root + "/public/images/onboarding/coffee.jpg")
    .resize(600)
    .webp()
    .toBuffer();
  await new Promise((r) => api.listen(55432, "127.0.0.1", r));
  const log = fs.openSync(out + "/server.log", "w");
  const app = spawn(
    "node",
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--port",
      "3188",
      "--hostname",
      "localhost",
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:55432",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "mock-key",
        APP_URL: "https://favx-v1.vercel.app",
        NODE_OPTIONS:
          "--require " + path.join(__dirname, "fixtures/library-provider.cjs"),
        BUNNY_ORIGINALS_STORAGE_ZONE: "fixture-private",
        BUNNY_ORIGINALS_STORAGE_HOST: "syd.storage.bunnycdn.com",
        BUNNY_ORIGINALS_ACCESS_KEY: "fixture-only",
        BUNNY_STORAGE_ZONE: "fixture-public",
      },
      stdio: ["ignore", log, log],
    },
  );
  let browser;
  try {
    for (let n = 0; n < 80; n++) {
      try {
        if ((await fetch("http://localhost:3188/pt-br")).status === 200) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const context = await browser.newContext({
      locale: "pt-BR",
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    const anon = await browser.newPage({
      locale: "pt-BR",
      viewport: { width: 390, height: 844 },
    });
    page.on("dialog", (d) => d.accept());
    page.on("pageerror", (e) => {
      failed = true;
      console.error("PAGE ERROR", e.message);
    });
    await auth(context, a);
    const origin = "http://localhost:3188";
    await page.goto(origin + `/app/creator/posts/${p1}`);
    assert.equal(await page.locator("h1").innerText(), payload.title);
    await page
      .getByRole("link", { name: "Histórico de versões", exact: true })
      .click();
    await page.getByText("Abrir versão", { exact: true }).click();
    assert.ok(
      (await page.locator("main").innerText()).includes("NEVER_PUBLIC_CONTEXT"),
    );
    const intruder = await browser.newContext();
    await auth(intruder, b);
    const other = await intruder.newPage();
    assert.equal(
      (
        await other.goto(origin + `/app/creator/posts/${p1}/historico`)
      ).status(),
      404,
    );
    assert.equal(
      (await other.goto(origin + `/app/creator/midias/${media}`)).status(),
      404,
    );
    assert.equal(
      await other.evaluate(
        async (id) =>
          (await fetch(`/api/creator/media/${id}/optimized`)).status,
        media,
      ),
      404,
    );
    await page.goto(origin + `/app/creator/midias/${media}`);
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("main img")).every(
        (i) => i.complete && i.naturalWidth > 0,
      ),
    );
    for (const label of ["Baixar imagem otimizada", "Baixar original"]) {
      const pending = page.waitForEvent("download");
      await page.getByRole("button", { name: label, exact: true }).click();
      const download = await pending;
      assert.equal(await download.failure(), null);
    }
    await page.goto(origin + "/app/creator/midias");
    await page.getByPlaceholder("Buscar pelo nome do arquivo").fill("missing");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    assert.ok(
      (await page.locator("main").innerText()).includes(
        "Nenhum conteúdo por aqui.",
      ),
    );
    await page.goto(origin + `/app/creator/posts/${p1}`);
    const stale = await context.newPage();
    await stale.goto(origin + `/app/creator/posts/${p1}`);
    async function action(name) {
      await page.getByRole("button", { name, exact: true }).click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Confirmar", exact: true })
        .click();
      await page.waitForFunction(() => !document.querySelector("dialog[open]"));
    }
    await action("Arquivar");
    await page
      .getByRole("button", { name: "Restaurar como rascunho", exact: true })
      .waitFor();
    assert.equal(
      (await anon.goto(origin + `/alice/p/cafe-${pub1}`)).status(),
      404,
    );
    assert.equal(
      await anon.evaluate(
        async (id) => (await fetch(`/api/media/post/${id}`)).status,
        media,
      ),
      404,
    );
    await stale
      .getByRole("button", { name: "Mover para a lixeira", exact: true })
      .click();
    await stale
      .getByRole("dialog")
      .getByRole("button", { name: "Confirmar", exact: true })
      .click();
    await stale
      .getByText(
        "Esta publicação mudou em outra janela. Atualize a página antes de tentar novamente.",
        { exact: true },
      )
      .waitFor();
    await stale.close();
    await page.goto(origin + "/app/creator/posts/encerrados");
    assert.ok((await page.locator("main").innerText()).includes(payload.title));
    await page.goto(origin + "/app/creator/midias");
    assert.ok((await page.locator("main").innerText()).includes("fixture.jpg"));
    await page.goto(origin + `/app/creator/posts/${p1}`);
    await action("Mover para a lixeira");
    await page
      .getByRole("button", { name: "Restaurar como rascunho", exact: true })
      .waitFor();
    await page.goto(origin + "/app/creator/lixeira");
    assert.ok((await page.locator("main").innerText()).includes(payload.title));
    await page.goto(origin + `/app/creator/posts/${p1}/editar`);
    assert.equal(new URL(page.url()).pathname, `/app/creator/posts/${p1}`);
    await action("Restaurar como rascunho");
    await page
      .getByRole("link", { name: "Editar post", exact: true })
      .waitFor();
    const restored = (
      await task(a, () =>
        db.query(
          "select lifecycle_state,public_id from public.creator_posts where id=$1",
          [p1],
        ),
      )
    ).rows[0];
    assert.equal(restored.lifecycle_state, "draft");
    assert.equal(restored.public_id, pub1);
    assert.equal(
      (await anon.goto(origin + `/alice/p/cafe-${pub1}`)).status(),
      404,
    );
    await action("Duplicar como rascunho");
    await page.waitForURL("**/editar");
    assert.notEqual(
      new URL(page.url()).pathname,
      `/app/creator/posts/${p1}/editar`,
    );
    const copies = (
      await task(a, () =>
        db.query(
          "select id,lifecycle_state from public.creator_posts where title=$1",
          [payload.title],
        ),
      )
    ).rows;
    assert.equal(copies.length, 2);
    assert.ok(copies.every((p) => p.lifecycle_state === "draft"));
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of [
        "/app/creator/posts",
        `/app/creator/posts/${p1}`,
        `/app/creator/posts/${p1}/historico`,
        "/app/creator/midias",
        `/app/creator/midias/${media}`,
        "/app/creator/lixeira",
        "/app/creator/posts/encerrados",
      ]) {
        await page.goto(origin + route);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          route + " overflow " + width,
        );
      }
      await page.goto(origin + `/app/creator/posts/${p1}`);
      await page.screenshot({
        path: out + `/management-${width}.png`,
        fullPage: true,
      });
    }
    await page.goto(origin + `/app/creator/posts/${p1}/historico`);
    await page
      .getByText("Comparar com a versão anterior", { exact: true })
      .first()
      .click();
    assert.ok((await page.locator("main").innerText()).includes("Na lixeira"));
    assert.equal(failed, false);
    console.log(
      "PASS compiled UI + SQL/RLS: history, owner-only media/downloads, archive/public revocation, version conflict, trash, draft restore, duplicate, 320/390/768/1440 layouts. Auth and Bunny transports are local fixtures.",
    );
  } finally {
    if (browser) await browser.close();
    app.kill("SIGTERM");
    api.close();
    await tail;
    await db.close();
  }
})().catch((e) => {
  console.error(e.stack);
  process.exitCode = 1;
});
