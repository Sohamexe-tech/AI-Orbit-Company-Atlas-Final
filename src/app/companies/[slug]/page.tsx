import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Linkedin, MapPin, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/container";
import { CompanyCard } from "@/components/companies/company-card";

async function getCompany(slug: string) {
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) return null;
  const related = await prisma.company.findMany({ where: { industry: company.industry, NOT: { id: company.id } }, orderBy: { featured: "desc" }, take: 3 });
  return { company, related };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCompany(slug);
  if (!result) return { title: "Company not found | AI Orbit" };
  return { title: `${result.company.name} | AI Orbit`, description: result.company.tagline };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getCompany(slug);
  if (!result) notFound();
  const { company, related } = result;
  return (
    <main>
      <section className="hero-glow border-b border-border-subtle"><Container className="py-10 md:py-14"><Link href="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-fg"><ArrowLeft className="size-4" /> Back to companies</Link><div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end"><div><div className="flex flex-wrap items-center gap-3"><div className="flex size-16 items-center justify-center rounded-panel border border-border bg-black text-lg font-black">{company.logoUrl || company.name.slice(0,2).toUpperCase()}</div><span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-fg-muted">{company.industry}</span>{company.verified && <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-fg"><Sparkles className="size-3" /> Verified</span>}</div><h1 className="mt-6 text-4xl font-black tracking-[-0.04em] md:text-6xl">{company.name}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-fg-muted">{company.tagline}</p></div><div className="rounded-panel border border-border bg-card p-5"><p className="eyebrow text-fg-subtle">Company snapshot</p><div className="mt-4 space-y-4 text-sm"><div className="flex justify-between gap-4"><span className="text-fg-subtle">Location</span><span className="text-right text-fg-soft">{company.location}</span></div><div className="flex justify-between gap-4"><span className="text-fg-subtle">Founded</span><span className="text-fg-soft">{company.foundedYear ?? "—"}</span></div><div className="flex justify-between gap-4"><span className="text-fg-subtle">Stage</span><span className="text-fg-soft">{company.fundingStage ?? "—"}</span></div><div className="flex justify-between gap-4"><span className="text-fg-subtle">Team</span><span className="text-fg-soft">{company.companySize ?? "—"}</span></div></div></div></div></Container></section>
      <Container className="py-12"><div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]"><article><p className="eyebrow text-accent-fg">About</p><h2 className="mt-3 text-2xl font-bold">What {company.name} is building</h2><p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-8 text-fg-muted">{company.description}</p></article><aside className="rounded-panel border border-border bg-card p-5"><p className="eyebrow text-fg-subtle">Explore</p><div className="mt-4 grid gap-2"><a href={company.websiteUrl} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-between rounded-control border border-border px-3 text-sm font-semibold hover:bg-hover">Website <ExternalLink className="size-4" /></a>{company.linkedinUrl && <a href={company.linkedinUrl} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-between rounded-control border border-border px-3 text-sm font-semibold hover:bg-hover">LinkedIn <Linkedin className="size-4" /></a>}{company.githubUrl && <a href={company.githubUrl} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-between rounded-control border border-border px-3 text-sm font-semibold hover:bg-hover">GitHub <Github className="size-4" /></a>}</div><p className="mt-5 flex items-center gap-2 text-xs text-fg-subtle"><MapPin className="size-3.5" /> {company.location}</p></aside></div>{related.length > 0 && <section className="mt-16 border-t border-border-subtle pt-10"><div className="flex items-end justify-between"><div><p className="eyebrow text-accent-fg">You may also like</p><h2 className="mt-2 text-2xl font-bold">More in {company.industry}</h2></div><Link href={`/companies?industry=${encodeURIComponent(company.industry)}`} className="text-sm font-semibold text-fg-muted hover:text-fg">View all</Link></div><div className="mt-6 grid gap-4 md:grid-cols-3">{related.map((item) => <CompanyCard key={item.id} company={item} />)}</div></section>}</Container>
    </main>
  );
}
