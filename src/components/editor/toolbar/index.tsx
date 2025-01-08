import cn from "classnames";
import {
  SquarePlus,
  Undo2,
  Redo2,
  PaintRoller,
  Eraser,
  Bold,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";
import HeaderSelector from "./header-selector";
import FontsizeSelector from "./fontsize-selector";
import TextTypeSelector from "./texttype-selector";
import styles from "./index.module.css";

const Toolbar = function () {
  return (
    <div className={styles.toolbar}>
      <div className={cn(styles.tool_group, styles.tool_plus)}>
        <SquarePlus />
      </div>
      <div className={styles.divider}></div>
      <div className={cn(styles.tool_group, styles.tool_action)}>
        <Undo2 />
        <Redo2 />
        <PaintRoller />
        <Eraser />
      </div>
      <div className={styles.divider}></div>
      <div className={cn(styles.tool_group, styles.tool_edit)}>
        <HeaderSelector />
        <FontsizeSelector />
        <Bold />
        <Italic />
        <Strikethrough />
        <Underline />
        <TextTypeSelector />
      </div>
    </div>
  );
};

export default Toolbar;
