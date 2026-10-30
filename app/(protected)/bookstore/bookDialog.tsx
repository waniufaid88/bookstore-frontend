"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { baseUrl, iconActionButton } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

const bookSchema = z.object({
  name: z.string().trim().min(1, "Book name is required"),
  description: z.string(),
  price: z.number().finite().min(0, "Price cannot be negative"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  class: z.string().trim().min(1, "Class is required"),
});

type BookFormData = z.infer<typeof bookSchema>;

export type Book = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  class: string;
  stock: number;
  canDelete: boolean;
};
export default function BookDialog({ book }: { book?: Book }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      name: book?.name ?? "",
      description: book?.description ?? "",
      price: book ? Number(book.price) : 0,
      stock: book?.stock ?? 0,
      class: book?.class ?? "",
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setError("");

    if (nextOpen) {
      reset({
        name: book?.name ?? "",
        description: book?.description ?? "",
        price: book ? Number(book.price) : 0,
        stock: book?.stock ?? 0,
        class: book?.class ?? "",
      });
    }
  }

  async function onSubmit(values: BookFormData) {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        book ? `${baseUrl}/books/${book.id}` : `${baseUrl}/books`,
        {
          method: book ? "PATCH" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "failed");
      }

      console.log("res is :", response);

      toast.success(
        book ? "Book updated successfully" : "Book added successfully",
      );

      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save book",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant={book ? "outline" : "default"}
            size={book ? "icon" : "default"}
            aria-label={book ? "Edit book" : undefined}
            className={book ? iconActionButton : "bg-green-600"}
          >
            {book ? <Pencil /> : "Add Book"}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{book ? "Edit Book" : "Add a New Book"}</DialogTitle>

            <DialogDescription>
              {book
                ? "Update the details of this book."
                : "Fill in the details for the new book."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Book Name</FieldLabel>
              <Input {...register("name")} placeholder="Enter book name..." />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                {...register("description")}
                placeholder="Enter book description..."
              />
              <FieldDescription>
                Provide a brief description of the book.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Price</FieldLabel>
              <Input
                {...register("price", { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Stock</FieldLabel>
              <Input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                min="0"
                step="1"
                placeholder="Enter stock quantity..."
              />
              {errors.stock && (
                <p className="text-sm text-red-600">{errors.stock.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Class</FieldLabel>
              <Input {...register("class")} placeholder="Enter class..." />
              {errors.class && (
                <p className="text-sm text-red-600">{errors.class.message}</p>
              )}
            </Field>
          </FieldGroup>

          {error && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-500 cursor-pointer"
              type="submit"
              disabled={saving || isSubmitting || !isDirty}
            >
              {saving ? "Saving..." : book ? "Update Book" : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
