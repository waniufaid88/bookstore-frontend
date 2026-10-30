"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function PaginationComponent({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <nav aria-label="Pagination" className="fixed bottom-6 right-6 z-50">
      <Button
        type="button"
        variant="outline"
        className="mx-2 cursor-pointer"
        onClick={() => goToPage(currentPage - 1)}
        disabled={isPending || currentPage <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        className="mx-2 cursor-pointer"
        onClick={() => goToPage(currentPage + 1)}
        disabled={isPending || currentPage >= totalPages}
      >
        {isPending ? "Loading..." : "Next"}
      </Button>
    </nav>
  );
}
