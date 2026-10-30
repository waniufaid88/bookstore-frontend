import { cookies } from "next/headers";
import { baseUrl } from "@/lib/utils";
import PaginationComponent from "@/components/pagination";
import TransactionHistoryPage, {
  type TransactionSummary,
} from "./transactionHistory";
import { SearchForm } from "@/components/searchForm";

type TransactionHistoryResponse = {
  transactions: TransactionSummary[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  search: string;
};

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 4;
  const search = params.search?.trim() ?? "";

  const response = await fetch(
    `${baseUrl}/books/transactions/history/summary?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transaction history");
  }

  const data: TransactionHistoryResponse = await response.json();

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <SearchForm
          initialValue={search}
          placeholder="Search transactions by person"
        />
      </div>

      <TransactionHistoryPage transactions={data.transactions} />
      <PaginationComponent
        currentPage={data.page}
        totalPages={data.totalPages}
      />
    </div>
  );
}

