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
  Quote,
  Minus,
} from "lucide-react";
import HeaderSelector from "./header-selector";
import FontsizeSelector from "./fontsize-selector";
import TextTypeSelector from "./texttype-selector";
import AlignmentSelector from "./alignment-selector";
import IndentSelector from "./indent-selector";
import LineHeightSelector from "./lineheight-selector";
import FontColorSelector from "./fontcolor-selector";
import BgColorSelector from "./bgcolor-selector";
import { Button } from "@/components/ui/button";
import {
  useContentState,
  type IContentState,
} from "../content/controllers/datasource-state";
import styles from "./index.module.css";

const Toolbar = function () {
  const { undoArr, redoArr, setDataSource } = useContentState(
    (state: IContentState) => state
  );

  return (
    <div className={styles.toolbar}>
      <div className={cn(styles.tool_group, styles.tool_plus)}>
        <Button className={styles.tool_button} variant="ghost">
          <SquarePlus size={16} style={{ color: "var(--theme-color)" }} />
        </Button>
      </div>
      <div className={cn(styles.tool_group, styles.tool_action)}>
        <Button
          className={styles.tool_button}
          onClick={() => setDataSource([], true)}
          disabled={undoArr.length === 1}
          variant="ghost"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          className={styles.tool_button}
          onClick={() => setDataSource([], false, true)}
          disabled={redoArr.length === 0}
          variant="ghost"
        >
          <Redo2 size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <PaintRoller size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <Eraser size={16} />
        </Button>
      </div>
      <div className={cn(styles.tool_group, styles.tool_edit)}>
        <HeaderSelector />
        <FontsizeSelector />
        <Button className={styles.tool_button} variant="ghost">
          <Bold size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <Italic size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <Strikethrough size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <Underline size={16} />
        </Button>
        <TextTypeSelector />
      </div>
      <div className={cn(styles.tool_group, styles.tool_colors)}>
        <FontColorSelector />
        <BgColorSelector />
      </div>
      <div className={cn(styles.tool_group, styles.tool_format)}>
        <AlignmentSelector />
        <Button className={styles.tool_button} variant="ghost">
          <List size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <ListOrdered size={16} />
        </Button>
        <IndentSelector />
        <LineHeightSelector />
      </div>
      <div className={cn(styles.tool_group, styles.tool_others)}>
        <Button className={styles.tool_button} variant="ghost">
          <SquareCheck size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <Link size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <Quote size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost">
          <Minus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
