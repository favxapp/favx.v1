export const REQUEST_STATES = ["draft", "open", "paused", "closed"] as const;
export const REVIEW_STATES = [
  "new",
  "reviewing",
  "selected",
  "rejected",
  "archived",
] as const;
export type RequestState = (typeof REQUEST_STATES)[number];
export type ReviewState = (typeof REVIEW_STATES)[number];
export type RequestContent = {
  title: string;
  description: string;
  category: string;
  instructions: string;
  state: RequestState;
  expires_at: string | null;
};
export type CommunityRequest = RequestContent & {
  id: string;
  version: number;
  created_at: string;
  updated_at: string;
  received?: number;
};
export type PublicRequest = Pick<
  CommunityRequest,
  "id" | "title" | "description" | "category" | "instructions" | "expires_at"
> & { username: string; display_name: string };
export type SubmissionContent = {
  title: string;
  description: string;
  category: string;
  url: string;
  consent: boolean;
};
export type Suggestion = Omit<SubmissionContent, "consent"> & {
  id: string;
  request_id: string;
  request_title: string;
  review_state: ReviewState;
  consent_version: string;
  submitted_at: string;
  reviewed_at: string | null;
  version: number;
};
export const EMPTY_REQUEST: RequestContent = {
  title: "",
  description: "",
  category: "",
  instructions: "",
  state: "draft",
  expires_at: null,
};
const bounded = (v: unknown, n: number, required = false): v is string =>
  typeof v === "string" &&
  Array.from(v).length <= n &&
  (!required || v.trim().length > 0);
export function parseRequest(input: unknown): RequestContent | null {
  if (!input || typeof input !== "object") return null;
  const d = input as Record<string, unknown>;
  if (
    !bounded(d.title, 160, true) ||
    !bounded(d.description, 3000) ||
    !bounded(d.category, 60) ||
    !bounded(d.instructions, 1500) ||
    !REQUEST_STATES.includes(d.state as RequestState)
  )
    return null;
  if (
    d.expires_at !== null &&
    (typeof d.expires_at !== "string" ||
      !/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?Z$/.test(d.expires_at) ||
      !Number.isFinite(Date.parse(d.expires_at)))
  )
    return null;
  return {
    title: d.title.trim(),
    description: d.description,
    category: d.category,
    instructions: d.instructions,
    state: d.state as RequestState,
    expires_at: d.expires_at as string | null,
  };
}
export function parseSuggestion(input: unknown): SubmissionContent | null {
  if (!input || typeof input !== "object") return null;
  const d = input as Record<string, unknown>;
  if (
    !bounded(d.title, 160, true) ||
    !bounded(d.description, 4000, true) ||
    !bounded(d.category, 60) ||
    !bounded(d.url, 2048) ||
    d.consent !== true
  )
    return null;
  if (d.url) {
    try {
      const u = new URL(d.url);
      if (
        u.protocol !== "https:" ||
        u.username ||
        u.password ||
        u.port ||
        /[\s\\@]/.test(d.url) ||
        !/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i.test(u.hostname)
      )
        return null;
    } catch {
      return null;
    }
  }
  return {
    title: d.title.trim(),
    description: d.description,
    category: d.category,
    url: d.url,
    consent: true,
  };
}
export const requestPath = (username: string, id: string) =>
  `/${username}/requests/${id}`;
