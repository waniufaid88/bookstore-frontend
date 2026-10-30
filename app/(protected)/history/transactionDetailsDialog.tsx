"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Transaction } from "./transactionHistory";

type Props = {
  group: {
    name: string;
    type: string;
    transactions: Transaction[];
  } | null;
  onOpenChange: (open: boolean) => void;
};

export default function TransactionDetailsDialog({
  group,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={!!group} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{group?.name}</DialogTitle>

          <DialogDescription>
            All {group?.type === "sale" ? "sales" : "purchases"} transactions.
          </DialogDescription>
        </DialogHeader>

        {group?.transactions.map((transaction) => (
          <div key={transaction.id} className="rounded-md border p-4">
            <div className="mb-3 flex flex-wrap justify-between gap-2 text-sm">
              <span className="font-medium capitalize">{transaction.type}</span>

              <span>
                {new Date(transaction.createdAt).toLocaleDateString("en-IN")}
              </span>

              <span className="font-medium">
                {transaction.amount != null
                  ? `RS: ${Number(transaction.amount).toLocaleString("en-IN")}`
                  : "—"}
              </span>
            </div>

            {transaction.items?.map((item, index) => (
              <div
                key={`${item.bookId}-${index}`}
                className="flex flex-wrap justify-between gap-2 border-t py-2 text-sm"
              >
                <span>{item.bookName}</span>
                <span>Qty: {item.quantity}</span>
                <span>
                  {item.unitPrice != null
                    ? `RS: ${Number(item.unitPrice).toLocaleString("en-IN")}`
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
