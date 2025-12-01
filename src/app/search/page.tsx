import { Suspense } from "react";
import SearchResults from "@/components/search/SearchResults";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-4 py-12 text-center text-sm text-ink-500">Loading search results...</div>}>
      <SearchResults />
    </Suspense>
  );
}

