import { cookies } from "next/headers";
import { baseUrl } from "@/lib/utils";
import { SaleView } from "./saleView";

const PAGE_SIZE = 4;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

type TransactionResponse = {
  transactions: import("@/components/transactionRecords").TransactionRecord[];
  page: number;
  totalPages: number;
};

export default async function Page({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  
  const [customersResponse, booksResponse, transactionsResponse] =
    await Promise.all([
      fetch(`${baseUrl}/customers?all=true`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }),
      fetch(`${baseUrl}/books?all=true`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }),
      fetch(
        `${baseUrl}/books/transactions/history?type=sale&page=${page}&limit=${PAGE_SIZE}`,
        {
          headers: { Cookie: cookieStore.toString() },
          cache: "no-store",
        },
      ),
    ]);

  if (!customersResponse.ok || !booksResponse.ok || !transactionsResponse.ok) {
    throw new Error("Failed to fetch sale form data or transaction history");
  }

  const customersData = await customersResponse.json();
  const booksData = await booksResponse.json();
  const transactionsData: TransactionResponse =
    await transactionsResponse.json();

  return (
    <div>
      <SaleView
        customers={customersData.customers}
        books={booksData.books}
        transactions={transactionsData.transactions ?? []}
        currentPage={transactionsData.page}
        totalPages={transactionsData.totalPages}
      />
    </div>
  );
}


