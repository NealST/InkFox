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
import type { ISelectorProps } from './types';
import { useSelectionRange, type ISelectionRange } from '../controllers/selection-range';
import { getFormatedContentByRange } from '../controllers/format';
import type { IBlockStateItem } from "../content/blocks/types";
import { produce } from 'immer';
import { useContentState, type IContentState } from "../controllers/datasource-state";
import styles from './index.module.css';

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

const processFontSizeStyle = function(style: string | undefined, newValue: string) {
  const newFontSizeStyle = `font-size:${newValue}px;`;
  if (!style) {
    return newFontSizeStyle;
  }
  const modeReg = /font-size:(.*?);/;
  if (modeReg.test(style)) {
    return style.replace(modeReg, newFontSizeStyle);
  }
  return style + newFontSizeStyle;
}

const FontsizeSelector = function(props: ISelectorProps) {
  const { disabled } = props;
  const [selectedSize, setSelectedSize] = useState("12");
  const selectionRange = useSelectionRange((state: ISelectionRange) => state.range);
  const { dataSource, setDataSource } = useContentState(
    (state: IContentState) => state
  );

  function handleChange(newValue: string) {
    setSelectedSize(newValue);
    setDataSource(getFormatedContentByRange(dataSource, selectionRange, (child: IBlockStateItem) => {
      return produce(child, draft => {
        draft.style = processFontSizeStyle(draft.style, newValue);
      });
    }));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          {selectedSize}px
          <ChevronsUpDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuRadioGroup
          value={selectedSize}
          onValueChange={handleChange}
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
