import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  Type,
  Superscript,
  Subscript,
  CodeXml,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const typeOptions = [
  {
    id: "superscript",
    Icon: Superscript,
  },
  {
    id: "subscript",
    Icon: Subscript,
  },
  {
    id: "inlinecode",
    Icon: CodeXml,
  },
];

const TextTypeSelector = function () {
  const [selectedType, setSelectedType] = useState("");
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Type />
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={selectedType}
          onValueChange={setSelectedType}
        >
          {typeOptions.map((item) => {
            const { id, Icon } = item;
            return (
              <DropdownMenuRadioItem key={id} value={id}>
                <span className={styles.type_item}>
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

export default TextTypeSelector;
