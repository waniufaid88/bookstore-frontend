"use client";

import { useState } from "react";
import {
  TransactionRecords,
  type TransactionRecord,
} from "@/components/transactionRecords";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SellBooksForm } from "./sellBooksForm";

type Customer = { id: string; name: string };

type Book = {
  id: string;
  name: string;
  price: number;
  stock: number;
  class: string;
};

type SaleViewProps = {
  customers: Customer[];
  books: Book[];
  transactions: TransactionRecord[];
  currentPage: number;
  totalPages: number;
};

export function SaleView({
  customers,
  books,
  transactions,
  currentPage,
  totalPages,
}: SaleViewProps) {
  const [saleOpen, setSaleOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Sale</h1>
        <div className="flex items-center gap-2">
          <Dialog open={saleOpen} onOpenChange={setSaleOpen}>
            <DialogTrigger render={<Button />}>Add sale</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <SellBooksForm books={books} customers={customers} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TransactionRecords
        type="sale"
        transactions={transactions}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}



