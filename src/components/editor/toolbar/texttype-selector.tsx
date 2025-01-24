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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ISelectorProps } from './types';
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
];

const TextTypeSelector = function(props: ISelectorProps) {
  const { disabled } = props;
  const [selectedType, setSelectedType] = useState("");
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Type size={16} />
          <ChevronsUpDown size={16} />
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
                <span className={styles.menu_item}>
                  <Icon size={16} />
                  <span className={styles.menu_item_text}>{t(id)}</span>
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
