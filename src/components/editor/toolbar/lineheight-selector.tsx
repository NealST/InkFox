import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, FileText } from "lucide-react";

const heightOptions = ["1", "1.15", "1.5", "2", "2.5", "3"];

const LineHeightSelector = function () {
  const [selectedHeight, setSelectedHeight] = useState("1");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <FileText size={16} />
          <ChevronsUpDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuRadioGroup
          value={selectedHeight}
          onValueChange={setSelectedHeight}
        >
          {heightOptions.map((item) => {
            return (
              <DropdownMenuRadioItem key={item} value={item}>
                {item}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LineHeightSelector;
