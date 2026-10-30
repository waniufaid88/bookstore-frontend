"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { baseUrl, cn, iconActionButton } from "@/lib/utils";
import type { BooksResponse } from "./page";
import type { Book } from "./bookDialog";

import { Button } from "@/components/ui/button";
import { LoaderCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ListGrid from "@/components/ListGrid";
import BookDialog from "./bookDialog";
import { SearchForm } from "@/components/searchForm";
import Sort from "@/components/sort";
import type { BookSort } from "@/components/sort";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type BooksViewProps = {
  initialData: BooksResponse;
};

async function getErrorMessage(response: Response) {
  const data = await response.json().catch(() => ({}));
  return data.error || "Something went wrong";
}

export default function BooksView({ initialData }: BooksViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<Book[]>(initialData.books);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadedPage, setLoadedPage] = useState(initialData.page);
  const [loadingMore, setLoadingMore] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setBooks(initialData.books);
    setLoadedPage(initialData.page);
  }, [initialData.books, initialData.page]);

  async function handleLoadMore() {
    if (loadingMore || books.length >= initialData.totalCount) return;
    setLoadingMore(true);
    try {
      const nextPage = loadedPage + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(initialData.limit),
        search: initialData.search,
        sortBy: initialData.sortBy,
      });
      const response = await fetch(`${baseUrl}/books?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error(await getErrorMessage(response));
      const data: BooksResponse = await response.json();
      setBooks((currentBooks) => {
        const existingIds = new Set(currentBooks.map((book) => book.id));
        const nextBooks = data.books.filter(
          (book) => !existingIds.has(book.id),
        );
        return [...currentBooks, ...nextBooks];
      });
      setLoadedPage(nextPage);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load more books",
      );
    } finally {
      setLoadingMore(false);
    }
  }

  function handleSortChange(sortBy: BookSort) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  async function handleDelete(book: Book) {
    setDeletingId(book.id);

    try {
      const response = await fetch(`${baseUrl}/books/${book.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setBooks((currentBooks) =>
        currentBooks.filter((item) => item.id !== book.id),
      );

      toast.success("Book deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Can't delete book");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="p-3 text-4xl font-bold text-green-600">Book Store</h1>
          <p className="px-3 text-sm text-muted-foreground">
            Total books: {initialData.totalCount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sort value={initialData.sortBy} onValueChange={handleSortChange} />
          <SearchForm
            initialValue={initialData.search}
            placeholder="Search by book name"
          />
          <ListGrid view={view} setView={setView} />
          <BookDialog />
        </div>
      </div>

      {books.length > 0 ? (
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              : "flex flex-col gap-3",
          )}
        >
          {books.map((book) => (
            <div
              style={
                view === "grid"
                  ? {
                      backgroundImage: "url('bg.avif')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {}
              }
              key={book.id}
              className={cn(
                "min-w-0 rounded-md flex flex-col justify-between  border border-gray-300 p-4 shadow-lg transition-shadow hover:shadow-lg",
                view === "list"
                  ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between "
                  : "rounded-tr-xl rounded-br-xl border-r-8 border-b-6 aspect-2/3",
              )}
            >
              <div
                className={cn(
                  "flex flex-col gap-4",
                  view === "list" &&
                    "sm:flex-row sm:items-center sm:justify-between",
                )}
              >
                <p
                  className={cn(
                    "mb-2 text-center text-[28px] font-bold text-3xl tracking-wider text-cyan-400",
                    view === "list" && "sm:mb-0 sm:min-w-50 sm:text-left",
                  )}
                >
                  {book.name}
                </p>

                <ul
                  className={cn(
                    "list-inside list-disc space-y-2 text-lg ",
                    view === "list" &&
                      "sm:flex sm:flex-1 sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 sm:space-y-0",
                  )}
                >
                  <li className={view === "grid" ? "hidden" : "text-green-500"}>
                    <span className="font-medium ">Description:</span>{" "}
                    {book.description || "N/A"}
                  </li>

                  <li className="text-green-500">
                    <span className="font-medium ">Price:</span> {book.price}
                  </li>

                  <li className="text-green-500 ">
                    <span className="font-medium ">Stock:</span>{" "}
                    <span
                      className={cn(
                        "inline-flex rounded px-2 py-0.5 font-semibold",
                        book.stock <= 5
                          ? "bg-amber-300 text-amber-900"
                          : "text-green-500",
                      )}
                    >
                      {book.stock === 0 ? "Out of stock" : book.stock}
                    </span>
                  </li>

                  <li className="text-green-500">
                    <span className="font-medium ">Class:</span> {book.class}
                  </li>
                </ul>
              </div>

              <div
                className={cn(
                  "flex shrink-0 justify-end gap-2",
                  view === "grid" ? "mt-4" : "self-end sm:self-center",
                )}
              >
                <BookDialog book={book} />

                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        className={iconActionButton}
                        disabled={deletingId !== null}
                        title={`Delete ${book.name}`}
                      />
                    }
                  >
                    <Trash2 className="text-red-700" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Book</AlertDialogTitle>
                      <AlertDialogDescription>
                        {book.canDelete ? (
                          <>
                            Are you sure you want to delete{" "}
                            <i className="text-green-700 font-semibold text-xl">
                              {book.name}
                            </i>{" "}
                            book?
                          </>
                        ) : (
                          <>
                            The{" "}
                            <i className="text-red-600 font-semibold text-xl">
                              {book.name}
                            </i>{" "}
                            book has transactions and cannot be deleted.`
                          </>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      {book.canDelete && (
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/85 cursor-pointer"
                          disabled={deletingId !== null}
                          onClick={() => handleDelete(book)}
                        >
                          Delete
                        </AlertDialogAction>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-muted-foreground">
          No books found.
        </p>
      )}

      {books.length < initialData.totalCount && (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <p className="text-sm text-muted-foreground">
            Showing {books.length} of {initialData.totalCount} books
          </p>
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            className="cursor-pointer"
          >
            {loadingMore ? "Loading..." : "Load more books"}
          </Button>
        </div>
      )}
      {books.length >= initialData.totalCount && books.length > 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Showing all {initialData.totalCount} books
        </p>
      )}
    </div>
  );
}
