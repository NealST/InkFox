import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, IndentIncrease, IndentDecrease } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const indentOptions = [
  {
    id: "indentincrease",
    Icon: IndentIncrease,
  },
  {
    id: "indentdecrease",
    Icon: IndentDecrease,
  },
];

const IndentSelector = function () {
  const [selectedIndent, setSelectedIndent] = useState("");
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <IndentIncrease />
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={selectedIndent}
          onValueChange={setSelectedIndent}
        >
          {indentOptions.map((item) => {
            const { id, Icon } = item;
            return (
              <DropdownMenuRadioItem key={id} value={id}>
                <span className={styles.indent_item}>
                  <Icon />
                  {t(id)}
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IndentSelector;
