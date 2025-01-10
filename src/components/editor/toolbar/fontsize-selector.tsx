import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

const sizeOptions = [
  "12",
  "13",
  "14",
  "15",
  "16",
  "19",
  "22",
  "24",
  "29",
  "32",
  "40",
  "48",
];

const FontsizeSelector = function () {
  const [selectedSize, setSelectedSize] = useState("12");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {selectedSize}px
          <ChevronsUpDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuRadioGroup
          value={selectedSize}
          onValueChange={setSelectedSize}
        >
          {sizeOptions.map((item) => {
            return (
              <DropdownMenuRadioItem key={item} value={item}>
                {item}px
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontsizeSelector;
