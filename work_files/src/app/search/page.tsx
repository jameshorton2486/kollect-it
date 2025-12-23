import { Suspense } from "react";
import { Metadata } from "next";
import SearchResults from "@/components/search/SearchResults";

export const metadata: Metadata = {
  title: "Search | Kollect-It",
  description: "Search our curated collection of fine art, rare books, collectibles, and militaria.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-ink-secondary">Loading search results...</p>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}

