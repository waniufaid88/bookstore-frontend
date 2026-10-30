"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Transaction = {
  id: string;
  type: string;
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
export type TransactionSummary = {
  personId: string | null;
  name: string | null;
  type: string;
  transactionCount: number;
  totalAmount: string | null;
  hasUnrecordedAmount: boolean;
  latestDate: string;
};

type Props = {
  transactions: TransactionSummary[];
};

export default function TransactionHistoryPage({ transactions }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-lg">
              Supplier/Customer
            </TableHead>
            <TableHead className="font-bold text-lg">Type</TableHead>
            <TableHead className="font-bold text-lg">Transactions</TableHead>
            <TableHead className="font-bold text-lg">Total Amount</TableHead>
            <TableHead className="font-bold text-lg">Latest Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow
                key={`${transaction.type}-${transaction.personId ?? "unknown"}`}
              >
                <TableCell>{transaction.name || "Unknown"}</TableCell>
                <TableCell
                  className={
                    transaction.type === "sale"
                      ? "text-green-500"
                      : "text-red-600"
                  }
                >
                  {transaction.type}
                </TableCell>
                <TableCell>{transaction.transactionCount}</TableCell>
                <TableCell>
                  {transaction.hasUnrecordedAmount ||
                  transaction.totalAmount == null
                    ? "Incomplete (some costs not recorded)"
                    : `RS: ${Number(transaction.totalAmount).toLocaleString("en-IN")}`}
                </TableCell>
                <TableCell>
                  {new Date(transaction.latestDate).toLocaleDateString("en-IN")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
