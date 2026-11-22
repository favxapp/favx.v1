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
    fs.mkdtempSync(path.join(os.tmpdir(), "favx-library-"));
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
  "get_post_media",
  "get_user_library",
  "get_shared_user_collection",
  "can_view_media",
  "save_recommendation",
  "browse_creator",
]);
const rpc = new Set([
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
    await page.goto(`http://localhost:3188/alice/p/cafe-${pub1}`);
    await page
      .getByRole("button", { name: "Salvar na biblioteca", exact: true })
      .click();
    await page.waitForURL("**/pt-br/login?next=*");
    const next = new URL(page.url()).searchParams.get("next");
    assert.equal(next, `/app/salvos/adicionar?post=${pub1}`);
    assert.ok(
      (await context.cookies()).some(
        (x) => x.name === "favx_save_intent" && x.httpOnly,
      ),
    );
    await auth(context, b);
    await page.goto("http://localhost:3188" + next);
    await page
      .getByText("Recomendação salva na sua biblioteca.", { exact: true })
      .waitFor();
    assert.ok(
      !(await context.cookies()).some((x) => x.name === "favx_save_intent"),
    );
    console.log("Save intent retained across login and consumed");
    const s1 = (
      await task(b, () => db.query("select id from public.user_saves"))
    ).rows[0].id;
    await page.goto(`http://localhost:3188/alice/p/cafe-${pub1}`);
    await page
      .getByRole("link", { name: "Salvo na biblioteca", exact: true })
      .waitFor();
    assert.equal(
      (await task(b, () => db.query("select id from public.user_saves"))).rows
        .length,
      1,
    );
    await page.goto(`http://localhost:3188/alice/p/cidade-${pub2}`);
    await page
      .getByRole("button", { name: "Salvar na biblioteca", exact: true })
      .click();
    await page
      .getByRole("link", { name: "Salvo na biblioteca", exact: true })
      .waitFor();
    await page.goto("http://localhost:3188/app/salvos");
    await page
      .getByRole("heading", { name: "Um café no parque", exact: true })
      .waitFor();
    await page
      .getByLabel("Buscar nos meus salvos", { exact: true })
      .fill("NEVER_PUBLIC_CONTEXT");
    await page
      .getByRole("button", { name: "Buscar nos meus salvos", exact: true })
      .click();
    await page
      .getByRole("heading", {
        name: "Nenhum resultado encontrado",
        exact: true,
      })
      .waitFor();
    await page.goto("http://localhost:3188/app/colecoes/nova");
    await page
      .getByLabel("Nome da coleção", { exact: true })
      .fill("Minhas pausas");
    await page
      .getByLabel("Descrição", { exact: true })
      .fill("Lugares para guardar.");
    await page.getByRole("checkbox", { name: /Um café no parque/ }).check();
    await page.getByRole("checkbox", { name: /Passeio na cidade/ }).check();
    await page
      .getByRole("button", { name: "Usar como capa", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Mover para baixo: Um café no parque",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Salvar alterações", exact: true })
      .click();
    await page.getByText("Coleção salva", { exact: true }).waitFor();
    let col = (
      await task(b, () => db.query("select * from public.user_collections"))
    ).rows[0];
    assert.equal(col.share_enabled, false);
    assert.equal(col.share_token, null);
    assert.equal(col.saved_ids[1], s1);
    assert.equal(col.cover_saved_id, s1);
    await page.reload();
    assert.equal(
      await page.getByLabel("Nome da coleção", { exact: true }).inputValue(),
      "Minhas pausas",
    );
    const other = await context.newPage();
    other.on("dialog", (d) => d.accept());
    await other.goto(page.url());
    await page
      .getByLabel("Nome da coleção", { exact: true })
      .fill("Pausas favoritas");
    await page
      .getByRole("button", { name: "Salvar alterações", exact: true })
      .click();
    await page.getByText("Coleção salva", { exact: true }).waitFor();
    await other
      .getByLabel("Nome da coleção", { exact: true })
      .fill("Alteração concorrente");
    await other
      .getByRole("button", { name: "Salvar alterações", exact: true })
      .click();
    await other
      .getByText(
        "Esta coleção mudou em outra janela. Atualize a página antes de tentar novamente.",
        { exact: true },
      )
      .waitFor();
    await other.close();
    console.log("Collection persistence, cover, order and conflict passed");
    await page.goto(`http://localhost:3188/app/colecoes/${col.id}`);
    await page
      .getByRole("button", { name: "Compartilhar coleção", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Ativar link de compartilhamento",
        exact: true,
      })
      .click();
    await page.getByLabel("Copiar link", { exact: true }).waitFor();
    const sharedPath = new URL(
      await page.getByLabel("Copiar link", { exact: true }).inputValue(),
    ).pathname;
    await anon.goto("http://localhost:3188" + sharedPath);
    await anon
      .getByRole("heading", { name: "Pausas favoritas", exact: true })
      .waitFor();
    assert.ok(!(await anon.content()).includes("NEVER_PUBLIC_CONTEXT"));
    assert.ok(!(await anon.content()).includes(b));
    assert.ok(!(await anon.content()).includes(s1));
    assert.ok(!(await anon.content()).includes("library-fixture@example.test"));
    await anon.screenshot({ path: out + "/shared-mobile.png", fullPage: true });
    await page
      .getByRole("button", { name: "Revogar link", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Ativar link de compartilhamento",
        exact: true,
      })
      .waitFor();
    assert.equal(
      (await anon.goto("http://localhost:3188" + sharedPath)).status(),
      404,
    );
    await page
      .getByRole("button", {
        name: "Ativar link de compartilhamento",
        exact: true,
      })
      .click();
    await page.getByLabel("Copiar link", { exact: true }).waitFor();
    const newPath = new URL(
      await page.getByLabel("Copiar link", { exact: true }).inputValue(),
    ).pathname;
    assert.notEqual(newPath, sharedPath);
    assert.equal(
      (await anon.goto("http://localhost:3188" + sharedPath)).status(),
      404,
    );
    await task(a, () =>
      db.query("select * from public.save_creator_post($1,1,$2,'hidden')", [
        p1,
        JSON.stringify(payload),
      ]),
    );
    await anon.goto("http://localhost:3188" + newPath);
    assert.equal(
      await anon.getByText("Um café no parque", { exact: true }).count(),
      0,
    );
    await page.goto(`http://localhost:3188/app/salvos/${s1}`);
    await page
      .getByRole("heading", { name: "Publicação indisponível", exact: true })
      .waitFor();
    assert.ok(!(await page.content()).includes("NEVER_PUBLIC_CONTEXT"));
    await page
      .getByRole("button", { name: "Remover dos salvos", exact: true })
      .click();
    await page.waitForURL("**/app/salvos");
    col = (
      await task(b, () => db.query("select * from public.user_collections"))
    ).rows[0];
    assert.equal(col.saved_ids.length, 1);
    assert.equal(col.cover_saved_id, null);
    assert.equal(
      (await task(a, () => db.query("select id from public.creator_posts")))
        .rows.length,
      2,
    );
    console.log("Sharing rotation/revocation and unavailable content passed");
    for (const path of [
      "/app/me",
      "/app/salvos",
      "/app/colecoes",
      `/app/colecoes/${col.id}`,
      `/app/colecoes/${col.id}/editar`,
    ]) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      const r = await page.goto("http://localhost:3188" + path);
      assert.equal(r.status(), 200);
      if (path === "/app/me")
        await page.screenshot({
          path: out + "/library-desktop.png",
          fullPage: true,
        });
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          "overflow " + path + " " + width,
        );
      }
      if (path === "/app/me")
        await page.screenshot({
          path: out + "/library-mobile.png",
          fullPage: true,
        });
    }
    const stranger = await browser.newContext({ locale: "pt-BR" });
    await auth(stranger, c);
    const strangerPage = await stranger.newPage();
    assert.equal(
      (
        await strangerPage.goto(`http://localhost:3188/app/colecoes/${col.id}`)
      ).status(),
      404,
    );
    await page.goto(`http://localhost:3188/app/colecoes/${col.id}`);
    await page
      .getByRole("button", { name: "Excluir coleção", exact: true })
      .click();
    await page.waitForURL("**/app/colecoes");
    assert.equal(
      (await task(b, () => db.query("select * from public.user_collections")))
        .rows.length,
      0,
    );
    assert.equal(
      (await task(b, () => db.query("select * from public.user_saves"))).rows
        .length,
      1,
    );
    assert.equal(
      (await anon.goto("http://localhost:3188" + newPath)).status(),
      404,
    );
    assert.equal(failed, false);
    console.log(
      "PASS real compiled UI/server actions + Postgres RLS: save/login intent, idempotency, search privacy, personal collection persistence/order/cover/concurrency, public share/revoke/rotate, unavailable placeholder, remove cleanup, collection delete preserves saves, cross-user 404, responsive 320/390/768.",
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
