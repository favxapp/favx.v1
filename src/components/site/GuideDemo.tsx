"use client";

import { useState } from "react";
import type { Messages } from "@/lib/i18n/messages";
import { Icon, type IconName } from "@/components/ui/Icon";

export function GuideDemo({ m }: { m: Messages["publicGuide"] }) {
  const [query, setQuery] = useState("");
  const items: { title: string; body: string; icon: IconName }[] = [
    { title: m.demoBook, body: m.demoBookBody, icon: "bookmark" },
    { title: m.demoCoffee, body: m.demoCoffeeBody, icon: "home" },
    { title: m.demoWalk, body: m.demoWalkBody, icon: "globe" },
  ];
  const normalize = (s: string) =>
    s.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();
  const visible = items.filter((item) =>
    normalize(item.title + " " + item.body).includes(normalize(query.trim())),
  );
  return (
    <section
      aria-labelledby="demo-heading"
      className="glass-panel rounded-[32px] p-6 sm:p-10"
    >
      <p className="eyebrow">{m.demoLabel}</p>
      <h2 id="demo-heading" className="text-2xl font-semibold tracking-tight">
        {m.demoTitle}
      </h2>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">{m.demoIntro}</p>
      <label
        htmlFor="guide-search"
        className="mb-2 mt-6 block text-sm font-semibold"
      >
        {m.demoSearch}
      </label>
      <div className="flex items-center gap-3 rounded-full border border-field bg-white px-4">
        <Icon name="search" className="shrink-0" />
        <input
          id="guide-search"
          type="search"
          maxLength={120}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-12 w-full min-w-0 rounded-full bg-transparent py-2"
        />
      </div>
      <div aria-live="polite" aria-atomic="true" className="mt-6">
        <ul className="grid gap-3 md:grid-cols-3">
          {visible.map((item) => (
            <li
              key={item.title}
              className="min-w-0 rounded-2xl border border-line bg-white p-5"
            >
              <span className="icon-tile">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-5 font-semibold">{item.title}</h3>
              <p className="mt-2 text-xs text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>
        {!visible.length && (
          <p className="rounded-2xl bg-soft p-6 text-sm">{m.demoEmpty}</p>
        )}
      </div>
    </section>
  );
}
