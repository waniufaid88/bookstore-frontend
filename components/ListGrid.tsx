import { Grid2x2, List } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "cn";

export default function ListGrid({
  view,
  setView,
}: {
  view: "list" | "grid";
  setView: (v: "list" | "grid") => void;
}) {
  return (
    <div className="flex flex-row rounded-lg bg-gray-200">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              className={cn("bg-transparent border-0 cursor-pointer", {
                "bg-primary": view === "grid",
              })}
              variant={"link"}
              onClick={() => setView("grid")}
            >
              <Grid2x2
                className={cn("text-secondary", {
                  "text-primary": view !== "grid",
                })}
              />
            </Button>
          }
        />
        <TooltipContent>Grid View</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              className={cn("bg-transparent border-0 cursor-pointer", {
                "bg-primary": view === "list",
              })}
              variant={"link"}
              onClick={() => setView("list")}
            >
              <List
                className={cn("text-secondary", {
                  "text-primary": view !== "list",
                })}
              />
            </Button>
          }
        />
        <TooltipContent>List View</TooltipContent>
      </Tooltip>
    </div>
  );
}
