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
  Hash,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const headerOptions = [
  {
    id: "bodytext",
    Icon: Hash,
  },
  {
    id: "headline1",
    Icon: Heading1,
  },
  {
    id: "headline2",
    Icon: Heading2,
  },
  {
    id: "headline3",
    Icon: Heading3,
  },
  {
    id: "headline4",
    Icon: Heading4,
  },
  {
    id: "headline5",
    Icon: Heading5,
  },
  {
    id: "headline6",
    Icon: Heading6,
  },
];

const HeaderSelector = function () {
  const [selectedHeaderId, setSelectedHeaderId] = useState("bodytext");
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {t(selectedHeaderId)}
          <ChevronsUpDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={selectedHeaderId}
          onValueChange={setSelectedHeaderId}
        >
          {headerOptions.map((item) => {
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

export default HeaderSelector;
