"use client";

import { useState } from "react";
import {
  TransactionRecords,
  type TransactionRecord,
} from "@/components/transactionRecords";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PurchaseBooksForm } from "./purchaseBooksForm";

type Supplier = {
  id: string;
  name: string;
};

type Book = {
  id: string;
  name: string;
  price: string | number;
  stock: number;
  class?: string;
};

type PurchaseViewProps = {
  suppliers: Supplier[];
  books: Book[];
  transactions: TransactionRecord[];
  currentPage: number;
  totalPages: number;
};

export function PurchaseView({
  suppliers,
  books,
  transactions,
  currentPage,
  totalPages,
}: PurchaseViewProps) {
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Purchase</h1>
        <div className="flex items-center gap-2">
          <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
            <DialogTrigger render={<Button />}>Add purchase</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <PurchaseBooksForm suppliers={suppliers} books={books} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TransactionRecords
        type="purchase"
        transactions={transactions}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}

