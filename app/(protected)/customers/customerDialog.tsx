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

export type Customer = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
};

type Props = {
  customer?: Customer;
};

const customerSchema = z.object({
  name: z.string().trim().min(1, "Customer name is required"),
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

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CustomerDialog({ customer }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
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
        name: customer?.name ?? "",
        email: customer?.email ?? "",
        address: customer?.address ?? "",
        phone: customer?.phone ?? "",
      });
    }
  }

  async function onSubmit(values: CustomerFormValues) {
    setIsSaving(true);

    try {
      const response = await fetch(
        customer
          ? `${baseUrl}/customers/${customer.id}`
          : `${baseUrl}/customers`,
        {
          method: customer ? "PATCH" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        const res = await response.json();
        throw new Error(
          res.error ?? `Failed to ${customer ? "update" : "create"} customer`,
        );
      }

      toast.success(
        customer
          ? "Customer updated successfully"
          : "Customer created successfully",
      );
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("Customer save failed:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant={customer ? "outline" : "default"}
            aria-label={customer ? "Edit customer" : undefined}
            size={customer ? "icon" : "default"}
            className={customer ? iconActionButton : "bg-green-500"}
          >
            {customer ? <Pencil className="h-4 w-4 " /> : "+ Add customer"}
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {customer ? "Edit customer" : "Add customer"}
            </DialogTitle>
            <DialogDescription>
              Enter the customer details below.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-3">
            <Field>
              <FieldLabel>Customer Name</FieldLabel>
              <Input
                {...register("name")}
                placeholder="Enter customer name..."
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                placeholder="Enter customer email..."
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel>Address</FieldLabel>
              <Input
                {...register("address")}
                placeholder="Enter customer address..."
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
                : customer
                  ? "Update customer"
                  : "Save customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}





