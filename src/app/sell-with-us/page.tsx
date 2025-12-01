import { redirect } from "next/navigation";

/**
 * Redirect /sell-with-us to /sell
 * This handles old links and common URL patterns
 */
export default function SellWithUsRedirect() {
  redirect("/sell");
}
