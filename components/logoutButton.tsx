"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LogoutButton({
  asMenuItem = false,
}: {
  asMenuItem?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Logout failed");
      }

      setConfirmOpen(false);
      router.replace("/login");
      toast.success("Logout successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {asMenuItem ? (
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault();
            setConfirmOpen(true);
          }}
          disabled={loading}
        >
          Log out
        </DropdownMenuItem>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setConfirmOpen(true)}
          disabled={loading}
        >
          Log out
        </Button>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button onClick={handleLogout} disabled={loading}>
              {loading ? "Logging out..." : "Log out"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

