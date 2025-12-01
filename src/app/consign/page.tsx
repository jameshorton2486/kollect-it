import { redirect } from "next/navigation";

/**
 * Redirect /consign to /sell
 * This handles direct URL access and old bookmarks
 */
export default function ConsignRedirect() {
  redirect("/sell");
}
