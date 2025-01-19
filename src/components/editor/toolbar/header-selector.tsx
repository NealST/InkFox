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
import {
  useContentState,
  type IContentState,
} from "../controllers/datasource-state";
import getBlockIndex from "../controllers/get-block-index";
import getUpdatedState from "../controllers/update-block";
import type { IBlockStateItem } from "../content/blocks/types";
import type { ISelectorProps } from './types';
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

const HeaderSelector = function(props: ISelectorProps) {
  const { disabled } = props;
  const [selectedHeaderId, setSelectedHeaderId] = useState("bodytext");
  const { dataSource, setDataSource } = useContentState(
    (state: IContentState) => state
  );
  const { t } = useTranslation();

  function handleChange(newHeaderId: string) {
    const { anchorNode } = document.getSelection() as Selection;
    if (!anchorNode) {
      return;
    }
    const anchorBlockIndex = getBlockIndex(anchorNode);
    const anchorBlock = dataSource[anchorBlockIndex];
    const isBodyText = newHeaderId === "bodytext";
    const newBlockInfo: IBlockStateItem = {
      name: isBodyText ? "paragraph" : "heading",
    };
    if (isBodyText) {
      newBlockInfo.children = [
        {
          name: "plain",
          text: anchorBlock.text,
        },
      ];
    } else {
      newBlockInfo.meta = {
        level: newHeaderId.replace("headline", ""),
      };
      // transform paragraph to heading
      if (anchorBlock.name === "paragraph") {
        newBlockInfo.text =
          anchorBlock.children?.map((item) => item.text).join("") || "";
      }
    }
    setSelectedHeaderId(newHeaderId);
    setDataSource(getUpdatedState(dataSource, newBlockInfo, anchorBlockIndex));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          {t(selectedHeaderId)}
          <ChevronsUpDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={selectedHeaderId}
          onValueChange={handleChange}
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
