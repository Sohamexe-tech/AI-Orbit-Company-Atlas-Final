import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });

  if (!company) return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Company not found" } }, { status: 404 });

  const related = await prisma.company.findMany({
    where: { industry: company.industry, NOT: { id: company.id } },
    orderBy: { featured: "desc" },
    take: 3,
  });

  return NextResponse.json({ ok: true, data: { ...company, related } });
}
