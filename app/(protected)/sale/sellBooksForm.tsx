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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn, baseUrl } from "@/lib/utils";

type Customer = {
  id: string;
  name: string;
};

type Book = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type SaleBooksFormProps = {
  customers: Customer[];
  books: Book[];
};

const sellBookSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  bookId: z.string().min(1, "Please select a book"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

type SellBookFormValues = z.infer<typeof sellBookSchema>;

export function SellBooksForm({
  customers,
  books: initialBooks,
}: SaleBooksFormProps) {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isSaving, setIsSaving] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const {
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    setValue,
    register,
    formState: { errors },
  } = useForm<SellBookFormValues>({
    resolver: zodResolver(sellBookSchema),
    defaultValues: {
      customerId: "",
      bookId: "",
      quantity: 1,
    },
  });

  const selectedBookId = watch("bookId");
  const selectedCustomerId = watch("customerId");
  const selectedQuantity = watch("quantity");

  const selectedBook = books.find((book) => book.id === selectedBookId);

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId,
  );

  async function sellBook(data: SellBookFormValues) {
    const book = books.find((item) => item.id === data.bookId);

    if (!book) {
      setError("bookId", {
        type: "manual",
        message: "Please select a valid book",
      });
      return;
    }

    if (data.quantity > book.stock) {
      setError("quantity", {
        type: "manual",
        message: `Only ${book.stock} copies are available`,
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${baseUrl}/books/sale`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: data.customerId,
          items: [
            {
              bookId: data.bookId,
              quantity: data.quantity,
            },
          ],
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Could not complete sale");
      }

      toast.success("Sale completed successfully");

      setBooks((currentBooks) =>
        currentBooks.map((item) =>
          item.id === data.bookId
            ? {
                ...item,
                stock: item.stock - data.quantity,
              }
            : item,
        ),
      );

      reset({
        customerId: "",
        bookId: "",
        quantity: 1,
      });

      router.refresh();
    } catch (error) {
      console.error("Sale failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Could not complete sale",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sale Books</DialogTitle>
        <DialogDescription>
          Select a customer, choose a book, and enter the quantity to complete
          the sale.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(sellBook)} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Customer</Label>

          <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
            <PopoverTrigger
              render={
                <Button
                  id="customerId"
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={customerOpen}
                  aria-invalid={!!errors.customerId}
                  className="w-full justify-between font-normal"
                />
              }
            >
              {selectedCustomer?.name ?? "Choose a customer"}
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search customers..." />
                <CommandList>
                  <CommandEmpty>No customer found.</CommandEmpty>

                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={`${customer.name} ${customer.id}`}
                      onSelect={() => {
                        setValue("customerId", customer.id, {
                          shouldValidate: true,
                        });
                        clearErrors("customerId");
                        setCustomerOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          selectedCustomerId === customer.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {customer.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {errors.customerId && (
            <p className="text-sm text-destructive">
              {errors.customerId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold">Book</Label>

          <Popover open={bookOpen} onOpenChange={setBookOpen}>
            <PopoverTrigger
              render={
                <Button
                  id="bookId"
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={bookOpen}
                  aria-invalid={!!errors.bookId}
                  className="w-full justify-between font-normal"
                />
              }
            >
              {selectedBook
                ? `${selectedBook.name} — ${selectedBook.stock} in stock`
                : "Choose a book"}

              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search books..." />

                <CommandList>
                  <CommandEmpty>No book found.</CommandEmpty>

                  {books.map((book) => (
                    <CommandItem
                      key={book.id}
                      value={`${book.name} ${book.id}`}
                      disabled={book.stock < 1}
                      onSelect={() => {
                        setValue("bookId", book.id, {
                          shouldValidate: true,
                        });
                        clearErrors(["bookId", "quantity"]);
                        setBookOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          selectedBookId === book.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />

                      <span>{book.name}</span>

                      <span className="ml-auto text-xs text-muted-foreground">
                        {book.stock} in stock
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
          <Label htmlFor="quantity" className="text-lg font-semibold">
            Quantity
          </Label>

          <Input
            id="quantity"
            type="number"
            min={1}
            max={selectedBook?.stock}
            step={1}
            {...register("quantity", {
              valueAsNumber: true,
              onChange: () => clearErrors("quantity"),
            })}
            className="w-full rounded-md border bg-background p-2 text-sm"
          />

          {errors.quantity && (
            <p className="text-sm text-destructive">
              {errors.quantity.message}
            </p>
          )}

          {selectedBook && (
            <p className="text-xs text-muted-foreground">
              Available stock: {selectedBook.stock}
            </p>
          )}
        </div>

        {selectedBook &&
          Number.isFinite(selectedQuantity) &&
          selectedQuantity > 0 && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">Estimated total</p>

              <p className="text-lg font-semibold">
                {(Number(selectedBook.price) * selectedQuantity).toFixed(2)}
              </p>
            </div>
          )}

        <DialogFooter>
          <Button
            type="submit"
            className="text-md font-semibold tracking-wider"
            disabled={isSaving || customers.length === 0 || books.length === 0}
          >
            {isSaving ? "Processing..." : "Complete Sale"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
