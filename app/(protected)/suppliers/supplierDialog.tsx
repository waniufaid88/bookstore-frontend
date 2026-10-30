"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { baseUrl, iconActionButton } from "@/lib/utils";
import { Pencil } from "lucide-react";

export type Supplier = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
};

type Props = {
  supplier?: Supplier;
};

const supplierSchema = z.object({
  name: z.string().trim().min(1, "supplier name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  address: z.string().trim().min(1, "Address is required"),
  // phone: z.string().trim().min(1, "Phone number is required"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
});

type supplierFormValues = z.infer<typeof supplierSchema>;

export function SupplierDialog({ supplier }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<supplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      reset({
        name: supplier?.name ?? "",
        email: supplier?.email ?? "",
        address: supplier?.address ?? "",
        phone: supplier?.phone ?? "",
      });
    }
  }

  async function onSubmit(values: supplierFormValues) {
    setIsSaving(true);

    try {
      const response = await fetch(
        supplier
          ? `${baseUrl}/suppliers/${supplier.id}`
          : `${baseUrl}/suppliers`,
        {
          method: supplier ? "PATCH" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to ${supplier ? "update" : "create"} supplier`);
      }

      toast.success(
        supplier
          ? "supplier updated successfully"
          : "supplier created successfully",
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("supplier save failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant={supplier ? "outline" : "default"}
            aria-label={supplier ? "Edit supplier" : undefined}
            size={supplier ? "icon" : "default"}
            className={supplier ? iconActionButton : "bg-green-500"}
          >
            {supplier ? <Pencil className="h-4 w-4" /> : "Add supplier"}
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {supplier ? "Edit supplier" : "Add supplier"}
            </DialogTitle>
            <DialogDescription>
              Enter the supplier details below.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-3">
            <Field>
              <FieldLabel>supplier Name</FieldLabel>
              <Input
                {...register("name")}
                placeholder="Enter supplier name..."
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                placeholder="Enter supplier email..."
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Address</FieldLabel>
              <Input
                {...register("address")}
                placeholder="Enter supplier address..."
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input
                {...register("phone")}
                placeholder="Enter phone number..."
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving…"
                : supplier
                  ? "Update supplier"
                  : "Save supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
