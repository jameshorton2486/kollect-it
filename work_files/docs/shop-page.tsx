import { redirect } from "next/navigation";

export const metadata = {
  title: "Shop | Kollect-It",
  description: "Browse our curated collection of antiques and collectibles.",
};

export default function ShopPage() {
  redirect("/browse");
}
