"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Company } from "@prisma/client";
import { CompanyCard } from "./company-card";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function CompanyExplorer({ initial, industries }: { initial: Company[]; industries: string[] }) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true); setError(false);
      try {
        const params = new URLSearchParams({ q: query, industry, sort, limit: "24" });
        const response = await fetch(`/api/companies?${params}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Request failed");
        const body = (await response.json()) as { data: Company[] };
        setItems(body.data);
      } catch { setError(true); } finally { setLoading(false); }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query, industry, sort, retryKey]);

  const hasFilters = query || industry !== "all" || sort !== "relevance";
  const clear = () => { setQuery(""); setIndustry("all"); setSort("relevance"); };
  const countLabel = useMemo(() => `${items.length} ${items.length === 1 ? "company" : "companies"}`, [items.length]);

  return (
    <main>
      <section className="hero-glow border-b border-border-subtle">
        <Container className="py-16 text-center md:py-24">
          <p className="eyebrow text-accent-fg">AI ecosystem / companies</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">Companies building the AI universe.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-fg-muted md:text-lg">Explore AI companies by focus, location and stage. Find the teams behind the tools, models and infrastructure shaping what comes next.</p>
          <div className="mx-auto mt-8 max-w-2xl rounded-control border border-border bg-surface p-1.5 shadow-float">
            <label className="flex h-12 items-center gap-3 px-3">
              <Search className="size-5 text-fg-muted" aria-hidden />
              <span className="sr-only">Search companies</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, categories or descriptions..." className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle" />
              {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="rounded-full p-1 text-fg-muted hover:bg-hover hover:text-fg"><X className="size-4" /></button>}
            </label>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <div className="flex flex-col gap-4 border-b border-border-subtle pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="mr-1 inline-flex items-center gap-2 text-sm font-semibold text-fg"><SlidersHorizontal className="size-4" /> Explore</span>
            <button onClick={() => setIndustry("all")} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${industry === "all" ? "border-fg bg-white text-black" : "border-border text-fg-muted hover:text-fg"}`}>All</button>
            {industries.map((name) => <button key={name} onClick={() => setIndustry(name)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${industry === name ? "border-fg bg-white text-black" : "border-border text-fg-muted hover:text-fg"}`}>{name}</button>)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-fg-subtle">Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-fg outline-none">
              <option value="relevance">Featured</option><option value="name">Name</option><option value="newest">Founded recently</option>
            </select>
            {hasFilters && <Button size="xs" variant="ghost" onClick={clear}>Clear</Button>}
          </div>
        </div>

        <div className="flex items-center justify-between py-6"><p className="text-sm text-fg-muted">{loading ? "Updating directory…" : countLabel}</p><p className="hidden text-xs text-fg-subtle sm:block">Curated company directory</p></div>

        {error ? (
          <div className="rounded-panel border border-border bg-card p-10 text-center"><h2 className="text-xl font-bold">We couldn't load the directory.</h2><p className="mt-2 text-sm text-fg-muted">Check your connection and try again.</p><Button className="mt-5" size="sm" onClick={() => setRetryKey((value) => value + 1)}>Try again</Button></div>
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-[245px] rounded-card border border-border" />)}</div>
        ) : items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((company) => <CompanyCard key={company.id} company={company} />)}</div>
        ) : (
          <div className="rounded-panel border border-border bg-card p-12 text-center"><h2 className="text-xl font-bold">No companies found.</h2><p className="mt-2 text-sm text-fg-muted">Try another search or remove a filter.</p><Button className="mt-5" size="sm" onClick={clear}>Reset filters</Button></div>
        )}
      </Container>
    </main>
  );
}
