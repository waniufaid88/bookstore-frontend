"use client";

import { useEffect, useState } from "react";

import type { Customer, CustomersResponse } from "./page";
import { baseUrl, iconActionButton } from "@/lib/utils";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { CustomerDialog } from "./customerDialog";
import { DeleteCustomer } from "./deleteCustomer";
import ListGrid from "@/components/ListGrid";
import CustomerTransactionDialog from "./customerTransactionDialog";
import { Eye } from "lucide-react";
import { SearchForm } from "@/components/searchForm";

type CustomersViewProps = {
  initialData: CustomersResponse;
};

export function CustomersView({ initialData }: CustomersViewProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialData.customers);
  const [loadedPage, setLoadedPage] = useState(initialData.page);
  const [loadingMore, setLoadingMore] = useState(false);

  const [view, setView] = useState<"grid" | "list">("grid");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  useEffect(() => {
    setCustomers(initialData.customers);
    setLoadedPage(initialData.page);
  }, [initialData.customers, initialData.page]);

  async function handleLoadMore() {
    if (loadingMore || customers.length >= initialData.totalCount) return;
    setLoadingMore(true);
    try {
      const nextPage = loadedPage + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialData.limit),
        search: initialData.search,
      });
      const response = await fetch(
        `${baseUrl}/customers?${params.toString()}`,
        {
          credentials: "include",
        },
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not load more customers");
      }
      const data: CustomersResponse = await response.json();
      setCustomers((current) => {
        const existingIds = new Set(current.map((customer) => customer.id));
        return [
          ...current,
          ...data.customers.filter((customer) => !existingIds.has(customer.id)),
        ];
      });
      setLoadedPage(nextPage);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load more customers",
      );
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="p-2 text-4xl font-bold text-green-500">Customers</h1>
          <p className="px-2 text-sm text-muted-foreground">
            Total customers: {initialData.totalCount}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SearchForm
            initialValue={initialData.search}
            placeholder="Search customers by name"
          />
          <ListGrid view={view} setView={setView} />

          <CustomerDialog />
        </div>
      </div>

      {customers.length ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              : "flex flex-col gap-3"
          }
        >
          {customers.map((customer) => (
            <div
              key={customer.id}
              className={`min-w-0 rounded-md border border-gray-300  p-4 shadow-sm transition-shadow hover:shadow-md ${
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
                    className={` text-lg font-semibold ${
                      view === "grid" ? "mb-3" : "mb-2"
                    }`}
                  >
                    {customer.name}
                  </h2>
                  <dl
                    className={`grid gap-x-6 gap-y-2  text-sm ${
                      view === "list"
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Email
                      </dt>
                      <dd>{customer.email}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Address
                      </dt>
                      <dd>{customer.address}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        Phone
                      </dt>
                      <dd>{customer.phone}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div
                className={`flex shrink-0 justify-end gap-2 ${
                  view === "grid" ? "mt-4" : "self-end sm:self-center"
                }`}
              >
                <CustomerDialog customer={customer} />
                <DeleteCustomer customerId={customer.id} />
                <Button
                  variant="outline"
                  size="icon"
                  className={iconActionButton}
                  aria-label={`View ${customer.name} transactions`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <Eye />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-muted-foreground">
          No customers found.
        </p>
      )}

      {customers.length < initialData.totalCount && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-muted-foreground">
            Showing {customers.length} of {initialData.totalCount} customers
          </p>
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
          >
            {loadingMore ? "Loading..." : "Load more customers"}
          </Button>
        </div>
      )}

      <CustomerTransactionDialog
        customer={selectedCustomer}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomer(null);
        }}
      />
    </>
  );
}
