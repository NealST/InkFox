import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ColorPicker from "./color-picker";
import { Palette, ChevronsUpDown } from "lucide-react";
import { useFormatRange, processStyle } from "./controllers/use-format-range";
import type { IBlockStateItem } from "../content/blocks/types";
import type { IColorSelectorProps } from "./types";
import styles from "./index.module.css";

const BgColorSelector = function (props: IColorSelectorProps) {
  const { disabled, initialColor = "" } = props;
  const [color, setColor] = useState(initialColor);
  const formatRange = useFormatRange();

  function handleChange(newColor: string) {
    setColor(newColor);
    formatRange((child: IBlockStateItem) => {
      return {
        ...child,
        style: processStyle(
          child.style || "",
          `background-color:${newColor};`,
          /background-color:(.*?);/
        ),
      };
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={styles.tool_button}
          variant="ghost"
          disabled={disabled}
        >
          <Palette size={16} color={color} />
          <ChevronsUpDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ColorPicker value={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  );
};

export default BgColorSelector;
