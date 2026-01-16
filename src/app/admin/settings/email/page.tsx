import { redirect } from "next/navigation";

// Force dynamic rendering - do not prerender this admin page
export const dynamic = "force-dynamic";

export default function EmailSettingsPage() {
  redirect("/admin/settings");
}
