import { getRequestLocale } from "@/lib/i18n/server";
import { Recovery } from "@/components/site/Recovery";
export default async function NotFound() {
  return <Recovery locale={await getRequestLocale()} kind="not-found" />;
}
