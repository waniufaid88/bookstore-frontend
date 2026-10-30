import { cookies } from "next/headers";
import { baseUrl } from "@/lib/utils";
import { CustomersView } from "./customersView";

export type Customer = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
};

export type CustomersResponse = {
  customers: Customer[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  search: string;
};

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
};

export default async function CustomersPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 4;
  const search = params.search?.trim() ?? "";

  const response = await fetch(
    `${baseUrl}/customers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Could not fetch customers.");
  }

  const data: CustomersResponse = await response.json();

  return (
    <div>
      <CustomersView initialData={data} />
    </div>
  );
}
