const http = require("node:http");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright-core");
const root = path.resolve(__dirname, "..");
const out =
  process.env.FAVX_TEST_OUTPUT ||
  fs.mkdtempSync(path.join(os.tmpdir(), "favx-public-"));
fs.mkdirSync(out, { recursive: true });
let failProfile = false;
const api = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  const body = raw ? JSON.parse(raw) : {};
  let data = [],
    status = 200;
  if (req.url === "/rest/v1/rpc/get_public_creator") {
    if (failProfile) {
      status = 503;
      data = { message: "PRIVATE_FIXTURE_ERROR_NOT_FOR_DISPLAY" };
    } else if (body.p_username === "guide-demo")
      data = [
        {
          username: "guide-demo",
          display_name: "Guide fixture",
          bio: "",
          avatar_path: null,
          social_links: [],
        },
      ];
  } else if (req.url === "/rest/v1/rpc/browse_creator")
    data = {
      posts: [],
      collections: [],
      categories: [],
      post_count: 0,
      total: 0,
    };
  else if (req.url?.startsWith("/auth/")) {
    status = 401;
    data = { message: "No session in this public fixture" };
  }
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
});
(async () => {
  console.log("Browser artifacts:", out);
  await new Promise((resolve) => api.listen(55434, "127.0.0.1", resolve));
  const log = fs.openSync(path.join(out, "server.log"), "a");
  const app = spawn(
    process.execPath,
    [
      path.join(root, "node_modules/next/dist/bin/next"),
      "start",
      "-H",
      "localhost",
      "-p",
      "3190",
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:55434",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "mock-key",
        APP_URL: "https://favx-v1.vercel.app",
      },
      stdio: ["ignore", log, log],
    },
  );
  let browser;
  try {
    const origin = "http://localhost:3190";
    let ready = false,
      lastReadiness = "";
    for (let i = 0; i < 80; i++) {
      try {
        const result = await fetch(origin + "/pt-br/como-funciona");
        if (result.ok) {
          ready = true;
          break;
        }
        lastReadiness = `${result.status}: ${(await result.text()).slice(0, 300)}`;
      } catch (e) {
        lastReadiness = String(e);
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    assert.ok(ready, "app started: " + lastReadiness);
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const context = await browser.newContext({
      locale: "en-US",
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const locale of ["pt-br", "pt-pt", "en", "es", "it", "fr"]) {
      const m = require(
        path.join(root, `src/lib/i18n/messages/${locale}.json`),
      );
      for (const route of ["como-funciona", "contato"]) {
        const response = await page.goto(`${origin}/${locale}/${route}`);
        assert.equal(response.status(), 200);
        assert.equal(await page.locator("h1").count(), 1);
        assert.ok(
          await page
            .getByRole("link", { name: m.publicGuide.support, exact: true })
            .count(),
        );
      }
      await page.goto(`${origin}/${locale}/page-does-not-exist`);
      await page
        .getByRole("heading", { name: m.notFound.title, exact: true })
        .waitFor();
      assert.equal(
        await page
          .getByRole("link", { name: m.publicGuide.support, exact: true })
          .first()
          .getAttribute("href"),
        `/${locale}/contato`,
      );
    }
    await page.goto(origin + "/pt-br/como-funciona");
    await page.getByRole("link", { name: /02 Encontrar/ }).click();
    await page
      .getByRole("heading", { name: "Encontre no perfil de quem você confia." })
      .waitFor();
    await page.getByLabel("Buscar nos exemplos").fill("cafe");
    assert.equal(
      await page.locator('section[aria-labelledby="demo-heading"] li').count(),
      1,
    );
    await page.getByLabel("Buscar nos exemplos").fill("not-a-match");
    await page
      .getByText("Nenhum exemplo encontrado.", { exact: false })
      .waitFor();
    await page.getByLabel("Buscar nos exemplos").fill("");
    assert.equal(
      await page.locator('section[aria-labelledby="demo-heading"] li').count(),
      3,
    );
    await page.getByRole("link", { name: /03 Salvar/ }).click();
    const start = page
      .locator("#guide-content")
      .getByRole("link", { name: "Começar" });
    assert.equal(
      new URL(await start.getAttribute("href"), origin).searchParams.get(
        "next",
      ),
      "/app/me",
    );
    await page
      .getByText("Preciso de uma conta para visitar?", { exact: true })
      .click();
    assert.ok(await page.locator("details[open]").count());
    await page.goto(origin + "/pt-br/contato");
    const payload =
      "A imagem não apareceu após selecionar o arquivo. & subject=not-a-header";
    await page.getByLabel("Assunto", { exact: true }).fill("Foto & imagem #1");
    await page.getByLabel("Categoria", { exact: true }).selectOption("media");
    await page.getByLabel("Descrição", { exact: true }).fill(payload);
    await page.getByRole("button", { name: "Revisar mensagem" }).click();
    assert.equal(
      await page.locator("dialog[open]").count(),
      0,
      "consent required",
    );
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Revisar mensagem" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const mail = new URL(
      await dialog
        .getByRole("link", { name: "Abrir aplicativo de e-mail" })
        .getAttribute("href"),
    );
    assert.equal(mail.pathname, "suporte@favx.app");
    assert.equal(mail.searchParams.get("body"), payload);
    assert.equal(mail.searchParams.size, 2);
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.lastCopied = text;
          },
        },
      }),
    );
    await dialog.getByRole("button", { name: "Copiar mensagem" }).click();
    await dialog.getByText("Mensagem copiada.", { exact: true }).waitFor();
    assert.match(
      await page.evaluate(() => window.lastCopied),
      /Foto & imagem #1/,
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error("Denied");
          },
        },
      }),
    );
    await dialog.getByRole("button", { name: "Copiar mensagem" }).click();
    await dialog
      .getByText("Não foi possível copiar.", { exact: false })
      .waitFor();
    assert.equal(
      await dialog.getByText("Mensagem copiada.", { exact: true }).count(),
      0,
    );
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      "support-prepared",
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
    assert.equal(
      await page.getByLabel("Descrição", { exact: true }).inputValue(),
      payload,
    );
    assert.equal(
      await page
        .locator("form")
        .evaluate((form) => [...new FormData(form).entries()].length),
      0,
      "native form cannot serialize the support draft",
    );
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noJs.newPage();
    await staticPage.goto(origin + "/pt-br/contato");
    assert.equal(
      await staticPage
        .getByRole("button", { name: "Revisar mensagem" })
        .isDisabled(),
      true,
    );
    assert.equal(
      await staticPage
        .getByRole("link", { name: "suporte@favx.app" })
        .getAttribute("href"),
      "mailto:suporte@favx.app",
    );
    await noJs.close();
    // Clipboard and native sharing are controlled platform fixtures; no messages are sent.
    await page.goto(origin + "/guide-demo");
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.lastCopied = text;
          },
        },
      });
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: undefined,
      });
    });
    await page
      .getByRole("button", { name: "Compartilhar", exact: true })
      .click();
    await page.getByText("Link copiado.", { exact: true }).waitFor();
    assert.equal(
      await page.evaluate(() => window.lastCopied),
      "https://favx-v1.vercel.app/guide-demo",
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error("Denied");
          },
        },
      }),
    );
    await page
      .getByRole("button", { name: "Copiar link", exact: true })
      .click();
    await page
      .getByText("Selecione o link acima e copie manualmente.", { exact: true })
      .waitFor();
    assert.equal(
      await page.getByLabel("Link para compartilhar").inputValue(),
      "https://favx-v1.vercel.app/guide-demo",
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async () => {
          throw new DOMException("Canceled", "AbortError");
        },
      }),
    );
    await page
      .getByRole("button", { name: "Compartilhar", exact: true })
      .click();
    assert.equal(
      await page.getByText("Link copiado.", { exact: true }).count(),
      0,
    );
    assert.equal(await page.getByLabel("Link para compartilhar").count(), 0);
    await page.evaluate(() =>
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async (data) => {
          window.lastShared = data;
        },
      }),
    );
    await page
      .getByRole("button", { name: "Compartilhar", exact: true })
      .click();
    await page
      .getByText("Compartilhamento concluído no dispositivo.", { exact: true })
      .waitFor();
    assert.equal(
      (await page.evaluate(() => window.lastShared)).url,
      "https://favx-v1.vercel.app/guide-demo",
    );
    assert.deepEqual(errors, []);
    // A provider failure exercises the real production error boundary without adding a debug route.
    failProfile = true;
    await page.goto(origin + "/guide-demo");
    const pt = require(path.join(root, "src/lib/i18n/messages/pt-br.json"));
    await page
      .getByRole("heading", { name: pt.error.title, exact: true })
      .waitFor();
    assert.ok(
      !(await page.locator("body").innerText()).includes(
        "PRIVATE_FIXTURE_ERROR_NOT_FOR_DISPLAY",
      ),
    );
    assert.equal(
      await page
        .getByRole("link", { name: "Contatar suporte", exact: true })
        .getAttribute("href"),
      "/pt-br/contato",
    );
    failProfile = false;
    await page
      .getByRole("button", { name: pt.error.retry, exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Guide fixture", exact: true })
      .waitFor();
    for (const route of ["como-funciona", "contato", "page-does-not-exist"])
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${origin}/pt-br/${route}`);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${route} overflow ${width}`,
        );
        assert.match(
          await page
            .locator("h1")
            .evaluate((el) => getComputedStyle(el).fontFamily),
          /Manrope/,
        );
        await page.screenshot({
          path: path.join(out, `${route}-${width}.png`),
          fullPage: true,
        });
      }
    console.log(
      "PASS public guides: six locales, tracks, scoped demo/empty search, FAQ, login destination, support validation/consent/preview/encoded mailto/copy fallback, share success/cancel/fallback, real error boundary/retry and responsive 404. No email sent; provider is a controlled fixture.",
    );
  } finally {
    await browser?.close();
    app.kill("SIGTERM");
    await new Promise((resolve) =>
      app.exitCode !== null ? resolve() : app.once("exit", resolve),
    );
    api.close();
    fs.closeSync(log);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
  api.close();
});
