"use client";

import { useEffect, useState } from "react";

import type { Supplier, SuppliersResponse } from "./page";
import { baseUrl, iconActionButton } from "@/lib/utils";
import toast from "react-hot-toast";

import { DeleteSupplier } from "./deleteSupplier";
import { SupplierDialog } from "./supplierDialog";
import ListGrid from "@/components/ListGrid";
import SupplierTransactionDialog from "./supplierTransactionDialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { SearchForm } from "@/components/searchForm";

type SuppliersViewProps = {
  initialData: SuppliersResponse;
};

export function SuppliersView({ initialData }: SuppliersViewProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialData.suppliers);
  const [loadedPage, setLoadedPage] = useState(initialData.page);
  const [loadingMore, setLoadingMore] = useState(false);

  const [view, setView] = useState<"grid" | "list">("grid");

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  useEffect(() => {
    setSuppliers(initialData.suppliers);
    setLoadedPage(initialData.page);
  }, [initialData.suppliers, initialData.page]);

  async function handleLoadMore() {
    if (loadingMore || suppliers.length >= initialData.totalCount) return;
    setLoadingMore(true);
    try {
      const nextPage = loadedPage + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialData.limit),
        search: initialData.search,
      });
      const response = await fetch(
        `${baseUrl}/suppliers?${params.toString()}`,
        {
          credentials: "include",
        },
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not load more suppliers");
      }
      const data: SuppliersResponse = await response.json();
      setSuppliers((current) => {
        const existingIds = new Set(current.map((supplier) => supplier.id));
        return [
          ...current,
          ...data.suppliers.filter((supplier) => !existingIds.has(supplier.id)),
        ];
      });
      setLoadedPage(nextPage);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load more suppliers",
      );
    } finally {
      setLoadingMore(false);
    }
  }
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="p-2 text-4xl font-bold text-green-500">Suppliers</h1>
          <p className="px-2 text-sm text-muted-foreground">
            Total suppliers: {initialData.totalCount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SearchForm
            initialValue={initialData.search}
            placeholder="Search suppliers by name"
          />
          <ListGrid view={view} setView={setView} />
          <SupplierDialog />
        </div>
      </div>

      {suppliers.length > 0 ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              : "flex flex-col gap-3"
          }
        >
          {suppliers.map((supplier) => (
            <article
              key={supplier.id}
              className={`min-w-0 rounded-md border border-gray-300 p-4 shadow-sm transition-shadow hover:shadow-md ${
                view === "list"
                  ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                  : ""
              }`}
            >
              <div
                className={`flex min-w-0 flex-1 gap-3 ${
                  view === "grid" ? "items-start" : "items-center"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h2
                    className={`text-lg font-semibold ${
                      view === "grid" ? "mb-3" : "mb-2"
                    }`}
                  >
                    {supplier.name}
                  </h2>

                  <dl
                    className={`grid gap-x-6 gap-y-2 text-sm ${
                      view === "list"
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Email
                      </dt>
                      <dd>{supplier.email}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Address
                      </dt>
                      <dd>{supplier.address}</dd>
                    </div>

                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Phone
                      </dt>
                      <dd>{supplier.phone}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div
                className={`flex shrink-0 justify-end gap-2 ${
                  view === "grid" ? "mt-4" : "self-end sm:self-center"
                }`}
              >
                <SupplierDialog supplier={supplier} />

                <DeleteSupplier supplierId={supplier.id} />

                <Button
                  variant="outline"
                  size="icon"
                  className={iconActionButton}
                  aria-label={`View ${supplier.name} transactions`}
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <Eye />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-10 text-center">
          <p className="font-medium">No suppliers found.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a supplier to see it here.
          </p>
        </div>
      )}

      {suppliers.length < initialData.totalCount && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-muted-foreground">
            Showing {suppliers.length} of {initialData.totalCount} suppliers
          </p>
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
          >
            {loadingMore ? "Loading..." : "Load more suppliers"}
          </Button>
        </div>
      )}
      <SupplierTransactionDialog
        supplier={selectedSupplier}
        onOpenChange={(open) => {
          if (!open) setSelectedSupplier(null);
        }}
      />
    </>
  );
}



