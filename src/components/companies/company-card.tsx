import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import type { Company } from "@prisma/client";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex min-h-[245px] flex-col rounded-card border border-border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-raised"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-control border border-border bg-black text-sm font-black tracking-tight text-fg">
          {company.logoUrl || company.name.slice(0, 2).toUpperCase()}
        </div>
        {company.verified && <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent-fg"><Sparkles className="size-3" /> Verified</span>}
      </div>
      <div className="mt-5">
        <h2 className="text-lg font-bold tracking-tight text-fg group-hover:text-white">{company.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-fg-muted">{company.tagline}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 text-xs text-fg-subtle">
        <span className="rounded-full border border-border px-2.5 py-1 text-fg-soft">{company.industry}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{company.location}</span>
        <ArrowUpRight className="ml-auto size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
