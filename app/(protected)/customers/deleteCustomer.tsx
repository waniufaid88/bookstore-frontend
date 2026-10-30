"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { baseUrl, iconActionButton } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

type Props = {
  customerId: string;
};

export function DeleteCustomer({ customerId }: Props) {
  const router = useRouter();

  async function deleteCustomer() {
    try {
      const response = await fetch(`${baseUrl}/customers/${customerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || data.message || "Could not delete customer.");
        return;
      }

      toast.success("Customer deleted successfully.");
      router.refresh();
    } catch (error) {
      console.error("Customer deletion failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not delete customer.",
      );
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className={iconActionButton}
            aria-label="Delete customer"
          />
        }
      >
        <Trash className="text-red-700" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this Customer ?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={deleteCustomer}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
