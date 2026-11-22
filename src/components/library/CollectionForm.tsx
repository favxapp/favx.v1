"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, TextArea, FormAlert } from "@/components/form";
import {
  savePersonalCollection,
  searchSaved,
} from "@/app/app/colecoes/actions";
import type { CollectionInput, PickerItem } from "@/lib/library/model";
import type { Messages } from "@/lib/i18n/messages";
import { Icon } from "@/components/ui/Icon";
export function CollectionForm({
  initial,
  initialItems,
  selectedItems,
  total,
  m,
}: {
  initial: CollectionInput;
  initialItems: PickerItem[];
  selectedItems: PickerItem[];
  total: number;
  m: Messages["library"];
}) {
  const [value, setValue] = useState(initial);
  const [items, setItems] = useState(initialItems);
  const [known, setKnown] = useState(() =>
    Object.fromEntries(
      [...initialItems, ...selectedItems].map((x) => [x.id, x]),
    ),
  );
  const [count, setCount] = useState(total);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const original = useRef(JSON.stringify(initial));
  const inFlight = useRef(false);
  const searchVersion = useRef(0);
  const router = useRouter();
  const dirty = JSON.stringify(value) !== original.current;
  useEffect(() => {
    if (!dirty) return;
    const unload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const click = (e: MouseEvent) => {
      if (
        (e.target as Element).closest("a[href]") &&
        !window.confirm(m.unsaved)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", click, true);
    };
  }, [dirty, m.unsaved]);
  function change(next: Partial<CollectionInput>) {
    setValue((v) => ({ ...v, ...next }));
    setSaved(false);
    setError(null);
  }
  function toggle(id: string) {
    const ids = value.saved_ids.includes(id)
      ? value.saved_ids.filter((x) => x !== id)
      : [...value.saved_ids, id];
    change({
      saved_ids: ids,
      cover_saved_id:
        value.cover_saved_id && ids.includes(value.cover_saved_id)
          ? value.cover_saved_id
          : null,
    });
  }
  function move(index: number, offset: number) {
    const ids = [...value.saved_ids];
    [ids[index], ids[index + offset]] = [ids[index + offset], ids[index]];
    change({ saved_ids: ids });
  }
  async function search(n: number) {
    const ticket = ++searchVersion.current;
    setSearching(true);
    setError(null);
    try {
      const r = await searchSaved(query, n);
      if (ticket !== searchVersion.current) return;
      if (r.error || !r.items) setError("failed");
      else {
        setItems(r.items);
        setKnown((v) => ({
          ...v,
          ...Object.fromEntries(r.items!.map((x) => [x.id, x])),
        }));
        setCount(r.total ?? 0);
        setPage(n);
      }
    } catch {
      if (ticket === searchVersion.current) setError("failed");
    } finally {
      if (ticket === searchVersion.current) setSearching(false);
    }
  }
  async function submit() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    try {
      const r = await savePersonalCollection(value);
      if (r.error || !r.saved) {
        setError(r.error ?? "failed");
        return;
      }
      const next = { ...value, version: r.saved.version };
      original.current = JSON.stringify(next);
      setValue(next);
      setSaved(true);
      if (window.location.pathname.endsWith("/nova"))
        window.history.replaceState(
          null,
          "",
          `/app/colecoes/${value.id}/editar`,
        );
      router.refresh();
    } catch {
      setError("failed");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }
  return (
    <div className="grid items-start gap-6 xl:grid-cols-2">
      <form
        className="discover-card space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <fieldset disabled={pending} className="min-w-0 space-y-5">
          <Field
            id="personal-title"
            label={m.collectionTitle}
            required
            maxLength={100}
            value={value.title}
            onChange={(e) => change({ title: e.target.value })}
          />
          <TextArea
            id="personal-description"
            label={m.description}
            maxLength={1000}
            value={value.description}
            onChange={(e) => change({ description: e.target.value })}
          />
          <p className="text-xs text-ink-muted">{m.collectionLimit}</p>
          <h2 className="text-sm font-semibold">
            {m.selected} · {value.saved_ids.length}
          </h2>
          <div className="space-y-2">
            {value.saved_ids.map((id, index) => {
              const item = known[id];
              return (
                <div className="collection-item flex-wrap" key={id}>
                  {item?.image && (
                    <img src={`/api/media/post/${item.image}`} alt="" />
                  )}
                  <span className="min-w-0 flex-1 break-words text-xs font-medium">
                    {item?.title ?? m.unavailable}
                  </span>
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      className="h-11 w-11 rounded-full hover:bg-white"
                      aria-label={`${m.up}: ${item?.title ?? m.unavailable}`}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="h-11 w-11 rounded-full hover:bg-white"
                      aria-label={`${m.down}: ${item?.title ?? m.unavailable}`}
                      disabled={index === value.saved_ids.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="h-11 w-11 rounded-full hover:bg-white"
                      aria-label={`${m.cancel}: ${item?.title ?? m.unavailable}`}
                      onClick={() => toggle(id)}
                    >
                      ×
                    </button>
                    {item?.image && (
                      <button
                        type="button"
                        className="min-h-11 rounded-full px-3 text-xs underline"
                        aria-pressed={value.cover_saved_id === id}
                        onClick={() =>
                          change({
                            cover_saved_id:
                              value.cover_saved_id === id ? null : id,
                          })
                        }
                      >
                        {value.cover_saved_id === id ? m.cover : m.makeCover}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <FormAlert
            message={
              error
                ? error === "conflict"
                  ? m.conflict
                  : error === "invalid"
                    ? m.invalid
                    : m.failed
                : null
            }
          />
          {saved && (
            <p role="status" className="text-sm">
              {m.collectionSaved}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button className="button-primary" disabled={pending} type="submit">
              {pending ? m.saving : m.saveChanges}
            </button>
            <Link
              href={
                value.version ? `/app/colecoes/${value.id}` : "/app/colecoes"
              }
              className="button-secondary"
            >
              {m.back}
            </Link>
          </div>
        </fieldset>
      </form>
      <section className="discover-card space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void search(1);
          }}
          className="space-y-3"
        >
          <Field
            id="saved-picker-search"
            label={m.searchItems}
            maxLength={120}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="button-secondary"
            type="submit"
            disabled={searching}
          >
            <Icon name="search" />
            {m.search}
          </button>
        </form>
        <fieldset
          disabled={pending || searching}
          className="space-y-2"
          aria-busy={searching}
        >
          {items.map((item) => (
            <label key={item.id} className="collection-item cursor-pointer">
              <input
                type="checkbox"
                checked={value.saved_ids.includes(item.id)}
                disabled={
                  value.saved_ids.length >= 200 &&
                  !value.saved_ids.includes(item.id)
                }
                onChange={() => toggle(item.id)}
              />
              {item.image && (
                <img
                  src={`/api/media/post/${item.image}`}
                  alt=""
                  loading="lazy"
                />
              )}
              <span className="min-w-0 break-words text-xs">
                {item.title ?? m.unavailable}
                {item.username && (
                  <small className="mt-1 block text-ink-muted">
                    @{item.username}
                  </small>
                )}
              </span>
            </label>
          ))}
          {!items.length && (
            <p className="py-8 text-sm text-ink-muted">{m.noResults}</p>
          )}
        </fieldset>
        <div className="flex flex-wrap justify-between gap-2">
          {page > 1 ? (
            <button
              className="button-secondary"
              disabled={searching}
              onClick={() => void search(page - 1)}
            >
              {m.previous}
            </button>
          ) : (
            <span />
          )}
          {count > page * 24 && (
            <button
              className="button-secondary"
              disabled={searching}
              onClick={() => void search(page + 1)}
            >
              {m.next}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
