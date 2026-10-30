"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "../history/transactionHistory";

type Supplier = { id: string; name: string };

type Props = {
  supplier: Supplier | null;
  onOpenChange: (open: boolean) => void;
};

export default function SupplierTransactionDialog({
  supplier,
  onOpenChange,
}: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const rows = transactions.flatMap((transaction) =>
    (transaction.items ?? []).map((item, index) => ({
      transaction,
      item,
      isFirstItem: index === 0,
    })),
  );
  useEffect(() => {
    if (!supplier) return;

    const supplierId = supplier.id;
    let cancelled = false;

    async function loadTransactions() {
      setLoading(true);
      setError("");
      setTransactions([]);

      try {
        const response = await fetch(
          `${baseUrl}/books/transactions/history?supplierId=${encodeURIComponent(supplierId)}`,
          { credentials: "include", cache: "no-store" },
        );

        if (!response.ok) throw new Error("Could not load transactions.");

        const data = await response.json();
        if (!cancelled) setTransactions(data.transactions ?? []);
      } catch {
        if (!cancelled) setError("Could not load transaction history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTransactions();
    return () => {
      cancelled = true;
    };
  }, [supplier]);

  return (
    <Dialog open={supplier !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{supplier?.name}'s transaction history</DialogTitle>
          <DialogDescription>
            Purchases recorded with this supplier.
          </DialogDescription>
        </DialogHeader>

        {loading && <p>Loading transactions...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && transactions.length === 0 && (
          <p>No transactions found for this supplier.</p>
        )}

        {!loading && !error && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ transaction, item, isFirstItem }) => (
                  <TableRow key={`${transaction.id}-${item.bookId}`}>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-IN",
                      )}
                    </TableCell>
                    <TableCell>{item.bookName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.unitPrice == null
                        ? "—"
                        : `RS: ${Number(item.unitPrice).toLocaleString("en-IN")}`}
                    </TableCell>
                    <TableCell>
                      {isFirstItem && transaction.amount != null
                        ? `RS: ${Number(transaction.amount).toLocaleString("en-IN")}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
