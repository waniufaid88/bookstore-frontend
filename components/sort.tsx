import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type BookSort = "name-asc" | "name-desc" | "price-asc" | "price-desc";

type SortProps = {
  value: BookSort;
  onValueChange: (value: BookSort) => void;
};

export default function Sort({ value, onValueChange }: SortProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onValueChange(value as BookSort)}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Sort books" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Books</SelectLabel>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
          <SelectItem value="name-desc">Name: Z to A</SelectItem>
          <SelectItem value="price-asc">Price: Low to high</SelectItem>
          <SelectItem value="price-desc">Price: High to low</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
