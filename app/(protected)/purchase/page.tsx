import { cookies } from "next/headers";
import { baseUrl } from "@/lib/utils";
import { PurchaseView } from "./purchaseView";

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
  
  const [suppliersResponse, booksResponse, transactionsResponse] =
    await Promise.all([
      fetch(`${baseUrl}/suppliers?all=true`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }),
      fetch(`${baseUrl}/books?all=true`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }),
      fetch(
        `${baseUrl}/books/transactions/history?type=purchase&page=${page}&limit=${PAGE_SIZE}`,
        {
          headers: { Cookie: cookieStore.toString() },
          cache: "no-store",
        },
      ),
    ]);

  if (!suppliersResponse.ok || !booksResponse.ok || !transactionsResponse.ok) {
    throw new Error("Failed to fetch purchase form data or transaction history");
  }

  const suppliersData = await suppliersResponse.json();
  const booksData = await booksResponse.json();
  const transactionsData: TransactionResponse =
    await transactionsResponse.json();

  return (
    <div>
      <PurchaseView
        suppliers={suppliersData.suppliers}
        books={booksData.books}
        transactions={transactionsData.transactions ?? []}
        currentPage={transactionsData.page}
        totalPages={transactionsData.totalPages}
      />
    </div>
  );
}


