"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, baseUrl } from "@/lib/utils";

const purchaseSchema = z.object({
  supplierId: z.string().min(1, "Please select a supplier"),
  bookId: z.string().min(1, "Please select a book"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  unitPrice: z.number().finite().min(0.01, "Purchase unit cost must be greater than 0"),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

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

type PurchaseBooksFormProps = {
  suppliers: Supplier[];
  books: Book[];
};

export function PurchaseBooksForm({
  suppliers,
  books: initialBooks,
}: PurchaseBooksFormProps) {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>(initialBooks);

  const [supplierOpen, setSupplierOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: "",
      bookId: "",
      quantity: 1,
        unitPrice: 0,
    },
  });

  const supplierId = watch("supplierId");
  const bookId = watch("bookId");

  const supplier = suppliers.find((s) => s.id === supplierId);
  const book = books.find((b) => b.id === bookId);

  async function onSubmit(values: PurchaseFormValues) {
    setSaving(true);

    try {
      const res = await fetch(`${baseUrl}/books/purchase`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplierId: values.supplierId,
          items: [
            {
              bookId: values.bookId,
              quantity: values.quantity,
              unitPrice: values.unitPrice,
            },
          ],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Purchase failed");
      }

      setBooks((currentBooks) =>
        currentBooks.map((b) =>
          b.id === values.bookId
            ? { ...b, stock: b.stock + values.quantity }
            : b,
        ),
      );

      reset({
        supplierId: "",
        bookId: "",
        quantity: 1,
        unitPrice: 0,
      });

      toast.success("Purchase recorded successfully");

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Purchase failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Purchase Books</DialogTitle>
        <DialogDescription>
          Select a supplier, book, and quantity.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label>Supplier</Label>

          <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled={suppliers.length === 0 || saving}
                />
              }
            >
              {supplier?.name || "Select supplier"}
              <ChevronsUpDown className="size-4 opacity-50" />
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search suppliers..." />
                <CommandList>
                  <CommandEmpty>No supplier found.</CommandEmpty>

                  {suppliers.map((s) => (
                    <CommandItem
                      key={s.id}
                      value={s.name}
                      onSelect={() => {
                        setValue("supplierId", s.id, {
                          shouldValidate: true,
                        });
                        setSupplierOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          supplierId === s.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {s.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {errors.supplierId && (
            <p className="text-sm text-destructive">
              {errors.supplierId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Book</Label>

          <Popover open={bookOpen} onOpenChange={setBookOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled={books.length === 0 || saving}
                />
              }
            >
              {book?.name || "Select book"}
              <ChevronsUpDown className="size-4 opacity-50" />
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search books..." />
                <CommandList>
                  <CommandEmpty>No book found.</CommandEmpty>

                  {books.map((b) => (
                    <CommandItem
                      key={b.id}
                      value={b.name}
                      onSelect={() => {
                        setValue("bookId", b.id, {
                          shouldValidate: true,
                        });
                        setBookOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          bookId === b.id ? "opacity-100" : "opacity-0",
                        )}
                      />

                      {b.name}

                      <span className="ml-auto text-xs text-muted-foreground">
                        Stock: {b.stock}
                      </span>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {errors.bookId && (
            <p className="text-sm text-destructive">{errors.bookId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitPrice">Purchase unit cost</Label>
          <Input
            id="unitPrice"
            type="number"
            min={0}
            step="0.01"
            placeholder="Enter cost per book"
            disabled={saving}
            {...register("unitPrice", { valueAsNumber: true })}
          />
          {errors.unitPrice && (
            <p className="text-sm text-destructive">{errors.unitPrice.message}</p>
          )}
          <Label htmlFor="quantity">Quantity</Label>

          <Input
            id="quantity"
            type="number"
            min={1}
            step={1}
            placeholder="Enter quantity"
            disabled={books.length === 0 || saving}
            {...register("quantity", { valueAsNumber: true })}
          />

          {errors.quantity && (
            <p className="text-sm text-destructive">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            disabled={saving || suppliers.length === 0 || books.length === 0}
          >
            {saving ? "Saving..." : "Record Purchase"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
