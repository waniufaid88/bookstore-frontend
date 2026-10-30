import { cookies } from "next/headers";
import { baseUrl } from "@/lib/utils";
import BooksView from "./booksView";
import type { Book } from "./bookDialog";

export type BooksResponse = {
  books: Book[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  search: string;
  sortBy: "name-asc" | "name-desc" | "price-asc" | "price-desc";
};
type PageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 8;
  const search = params.search?.trim() ?? "";
  const sortBy =
    params.sortBy === "name-desc" ||
    params.sortBy === "price-asc" ||
    params.sortBy === "price-desc"
      ? params.sortBy
      : "name-asc";

  const response = await fetch(
    `${baseUrl}/books?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sortBy=${sortBy}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Please log in to view your books."
        : "Could not fetch books.",
    );
  }

  const data: BooksResponse = await response.json();

  return (
    <div>
      <BooksView initialData={data} />
    </div>
  );
}
