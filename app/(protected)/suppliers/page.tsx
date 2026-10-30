import { cookies } from "next/headers";

import { baseUrl } from "@/lib/utils";
import { SuppliersView } from "./suppliersView";

export type Supplier = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  profileImage?: string | null;
};

export type SuppliersResponse = {
  suppliers: Supplier[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  search: string;
};

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
};

export default async function SuppliersPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 4;
  const search = params.search?.trim() ?? "";

  const response = await fetch(
    `${baseUrl}/suppliers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Could not fetch suppliers.");
  }

  const data: SuppliersResponse = await response.json();

  return (
    <div>
      <SuppliersView initialData={data} />
    </div>
  );
}
