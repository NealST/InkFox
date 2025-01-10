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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const alignOptions = [
  {
    id: "alignleft",
    Icon: AlignLeft,
  },
  {
    id: "aligncenter",
    Icon: AlignCenter,
  },
  {
    id: "alignright",
    Icon: AlignRight,
  },
  {
    id: "alignjustify",
    Icon: AlignJustify,
  },
];

const AlignmentSelector = function () {
  const [selectedAlign, setSelectedAlign] = useState("");
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <AlignLeft size={16} />
          <ChevronsUpDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuRadioGroup
          value={selectedAlign}
          onValueChange={setSelectedAlign}
        >
          {alignOptions.map((item) => {
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

export default AlignmentSelector;
