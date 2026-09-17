import type { Metadata } from "next";
import { CompanyExplorer } from "@/components/companies/company-explorer";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "AI Companies | AI Orbit",
  description:
    "Discover companies building the AI ecosystem across models, infrastructure, agents and applied AI.",
};

export default async function CompaniesPage() {
  const [initial, rows] = await Promise.all([
    prisma.company.findMany({
      orderBy: [{ featured: "desc" }, { name: "asc" }],
      take: 24,
    }),
    prisma.company.findMany({
      distinct: ["industry"],
      select: { industry: true },
      orderBy: { industry: "asc" },
    }),
  ]);

  return (
    <CompanyExplorer
      initial={initial}
      industries={rows.map((row) => row.industry)}
    />
  );
}