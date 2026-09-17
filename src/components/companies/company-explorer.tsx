"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { CompanyCard } from "@/components/companies/company-card";
import { Button } from "@/components/ui/button";

type Company = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  location: string;
  logoUrl: string | null;
  websiteUrl: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  foundedYear: number | null;
  fundingStage: string | null;
  companySize: string | null;
  featured: boolean;
  verified: boolean;
};

type CompanyExplorerProps = {
  initial: Company[];
  industries: string[];
};

export function CompanyExplorer({
  initial,
  industries,
}: CompanyExplorerProps) {
  const [items, setItems] = useState<Company[]>(initial);
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCompanies() {
      setLoading(true);
      setError(false);

      try {
        const params = new URLSearchParams();

        if (query.trim()) {
          params.set("query", query.trim());
        }

        if (industry) {
          params.set("industry", industry);
        }

        if (sort) {
          params.set("sort", sort);
        }

        const response = await fetch(
          `/api/companies?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load companies");
        }

        const data = await response.json();
        setItems(data.companies ?? data ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();

    return () => controller.abort();
  }, [query, industry, sort, retryKey]);

  const filteredItems = useMemo(() => {
    return items;
  }, [items]);

  function clearFilters() {
    setQuery("");
    setIndustry("");
    setSort("featured");
  }

  const hasFilters = Boolean(query || industry || sort !== "featured");

  return (
    <Container className="py-12">
      <div className="flex flex-col gap-8">
        <div>
          <p className="eyebrow text-accent-fg">Company directory</p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Explore AI companies
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-fg-muted">
            Discover companies building the AI ecosystem across models,
            infrastructure, agents and applied AI.
          </p>
        </div>

        <div className="rounded-panel border border-border bg-card p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search companies..."
                className="h-11 w-full rounded-control border border-border bg-bg px-10 text-sm outline-none placeholder:text-fg-subtle focus:border-accent"
              />
            </label>

            <select
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              className="h-11 rounded-control border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
            >
              <option value="">All industries</option>

              {industries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 rounded-control border border-border bg-bg px-3 text-sm outline-none focus:border-accent"
            >
              <option value="featured">Featured</option>
              <option value="name">Name</option>
              <option value="founded">Founded</option>
            </select>

            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-11"
            >
              <SlidersHorizontal className="size-4" />
              Clear
            </Button>
          </div>

          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
              <span>Active filters:</span>

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 hover:bg-hover"
                >
                  Search: {query}
                  <X className="size-3" />
                </button>
              )}

              {industry && (
                <button
                  type="button"
                  onClick={() => setIndustry("")}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 hover:bg-hover"
                >
                  {industry}
                  <X className="size-3" />
                </button>
              )}

              {sort !== "featured" && (
                <button
                  type="button"
                  onClick={() => setSort("featured")}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 hover:bg-hover"
                >
                  Sort: {sort}
                  <X className="size-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-panel border border-border bg-card"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-panel border border-border bg-card p-8 text-center">
            <p className="eyebrow text-accent-fg">Directory error</p>

            <h2 className="mt-3 text-xl font-bold">
              We couldn&apos;t load the directory.
            </h2>

            <p className="mt-2 text-sm text-fg-muted">
              Please try again.
            </p>

            <Button
              type="button"
              className="mt-5"
              onClick={() => setRetryKey((value) => value + 1)}
            >
              Try again
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-panel border border-border bg-card p-8 text-center">
            <p className="eyebrow text-fg-subtle">No results</p>

            <h2 className="mt-3 text-xl font-bold">
              No companies found
            </h2>

            <p className="mt-2 text-sm text-fg-muted">
              Try changing your search or filters.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}