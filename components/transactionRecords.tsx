"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationComponent from "@/components/pagination";

export type TransactionRecord = {
  id: string;
  type: "sale" | "purchase";
  amount: string | number | null;
  createdAt: string;
  name: string | null;
  items?: {
    bookId: string;
    bookName: string;
    quantity: number;
    unitPrice: string | number | null;
  }[];
};

type Props = {
  type: "sale" | "purchase";
  transactions: TransactionRecord[];
  currentPage: number;
  totalPages: number;
};

export function TransactionRecords({
  type,
  transactions,
  currentPage,
  totalPages,
}: Props) {
  const personLabel = type === "sale" ? "Customer" : "Supplier";
  const emptyLabel = type === "sale" ? "sales" : "purchases";

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-lg">Date</TableHead>
              <TableHead className="font-bold text-lg">{personLabel}</TableHead>
              <TableHead className="font-bold text-lg">
                Books and quantities
              </TableHead>
              <TableHead className="font-bold text-lg text-right">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "en-IN",
                    )}
                  </TableCell>
                  <TableCell>{transaction.name || "Unknown"}</TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {transaction.items?.map((item, index) => (
                        <li key={`${item.bookId}-${index}`}>
                          {item.bookName}{" "}
                          <span className="text-muted-foreground">
                            × {item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {transaction.amount == null
                      ? "Cost not recorded"
                      : `₹${Number(transaction.amount).toLocaleString("en-IN")}`}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No {emptyLabel} recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationComponent currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
