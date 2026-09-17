import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const industry = searchParams.get("industry")?.trim() ?? "";
  const sort = searchParams.get("sort") ?? "relevance";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(24, Math.max(6, Number(searchParams.get("limit") ?? "12") || 12));

  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { tagline: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(industry && industry !== "all" ? { industry } : {}),
  };

  const orderBy = sort === "name" ? { name: "asc" as const } : sort === "newest" ? { foundedYear: "desc" as const } : { featured: "desc" as const };
  const [companies, total, industries] = await Promise.all([
    prisma.company.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
    prisma.company.count({ where }),
    prisma.company.findMany({ distinct: ["industry"], select: { industry: true }, orderBy: { industry: "asc" } }),
  ]);

  return NextResponse.json({
    ok: true,
    data: companies,
    meta: { total, page, limit, pages: Math.ceil(total / limit), industries: industries.map((item) => item.industry) },
  });
}
