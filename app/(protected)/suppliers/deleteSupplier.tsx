"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { baseUrl, iconActionButton } from "@/lib/utils";
import { Trash } from "lucide-react";
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

type Props = {
  supplierId: string;
};

export function DeleteSupplier({ supplierId }: Props) {
  const router = useRouter();

  async function deleteSupplier() {
    try {
      const response = await fetch(`${baseUrl}/suppliers/${supplierId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || data.message || "Could not delete supplier.");
        return;
      }

      toast.success("Supplier deleted successfully.");
      router.refresh();
    } catch (error) {
      console.error("Supplier deletion failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not delete Supplier.",
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
            aria-label="Delete supplier"
          />
        }
      >
        <Trash className="text-red-700" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this Supplier ?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={deleteSupplier}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
