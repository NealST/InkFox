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
import { useTranslation } from "react-i18next";

const headerOptions = [
  {
    id: "bodytext",
  },
  {
    id: "headline1",
  },
  {
    id: "headline2",
  },
  {
    id: "headline3",
  },
  {
    id: "headline4",
  },
  {
    id: "headline5",
  },
  {
    id: "headline6",
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
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={selectedHeaderId}
          onValueChange={setSelectedHeaderId}
        >
          {headerOptions.map((item) => {
            const { id } = item;
            return (
              <DropdownMenuRadioItem key={id} value={id}>
                {t(id)}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderSelector;
