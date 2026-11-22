// Test-only interception: fake Bunny credentials never leave the isolated fixture.
const original = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = String(input);
  if (url.startsWith("https://syd.storage.bunnycdn.com/")) {
    if (new Headers(init?.headers).get("AccessKey") !== "fixture-only")
      throw Error("Unexpected storage credential");
    return original(
      "http://127.0.0.1:55432/mock-storage/" + url.split(".com/")[1],
      init,
    );
  }
  return original(input, init);
};
