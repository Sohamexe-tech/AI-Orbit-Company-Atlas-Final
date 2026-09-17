import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function CompanyNotFound() {
  return (
    <Container className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <p className="eyebrow text-accent-fg">404</p>
      <h1 className="mt-3 text-4xl font-black">Company not found</h1>
      <p className="mt-3 max-w-md text-fg-muted">
        The company you&apos;re looking for isn&apos;t in the directory.
      </p>
      <Link
        href="/companies"
        className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
      >
        Back to companies
      </Link>
    </Container>
  );
}