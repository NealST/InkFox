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
  List,
  ListOrdered,
  SquareCheck,
  Link,
  Quote
} from "lucide-react";
import HeaderSelector from "./header-selector";
import FontsizeSelector from "./fontsize-selector";
import TextTypeSelector from "./texttype-selector";
import AlignmentSelector from "./alignment-selector";
import IndentSelector from "./indent-selector";
import LineHeightSelector from "./lineheight-selector";
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
      <div className={styles.divider}></div>
      <div className={cn(styles.tool_group, styles.tool_colors)}>

      </div>
      <div className={styles.divider}></div>
      <div className={cn(styles.tool_group, styles.tool_format)}>
        <AlignmentSelector />
        <List />
        <ListOrdered />
        <IndentSelector />
        <LineHeightSelector />
      </div>
      <div className={styles.divider}></div>
      <div className={cn(styles.tool_group, styles.tool_others)}>
        <SquareCheck />
        <Link />
        <Quote />
      </div>
    </div>
  );
};

export default Toolbar;
