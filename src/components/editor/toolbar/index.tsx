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
  CodeXml,
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
} from "../controllers/datasource-state";
import { useToolbarDisabled, type IToolbarDisable } from '../controllers/toolbar-disable';
import styles from "./index.module.css";

const Toolbar = function() {
  const { undoArr, redoArr, setDataSource } = useContentState(
    (state: IContentState) => state
  );
  const disabled = useToolbarDisabled((state: IToolbarDisable) => state.disabled);

  return (
    <div className={styles.toolbar}>
      <div className={cn(styles.tool_group, styles.tool_plus)}>
        <Button disabled={disabled} className={styles.tool_button} variant="ghost">
          <SquarePlus size={16} style={{ color: "var(--theme-color)" }} />
        </Button>
      </div>
      <div className={cn(styles.tool_group, styles.tool_action)}>
        <Button
          className={styles.tool_button}
          onClick={() => setDataSource([], true)}
          disabled={disabled || undoArr.length === 1}
          variant="ghost"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          className={styles.tool_button}
          onClick={() => setDataSource([], false, true)}
          disabled={disabled || redoArr.length === 0}
          variant="ghost"
        >
          <Redo2 size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <PaintRoller size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Eraser size={16} />
        </Button>
      </div>
      <div className={cn(styles.tool_group, styles.tool_edit)}>
        <HeaderSelector disabled={disabled} />
        <FontsizeSelector disabled={disabled} />
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Bold size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Italic size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Strikethrough size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Underline size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <CodeXml size={16} />
        </Button>
        <TextTypeSelector disabled={disabled} />
      </div>
      <div className={cn(styles.tool_group, styles.tool_colors)}>
        <FontColorSelector disabled={disabled} />
        <BgColorSelector disabled={disabled} />
      </div>
      <div className={cn(styles.tool_group, styles.tool_format)}>
        <AlignmentSelector disabled={disabled} />
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <List size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <ListOrdered size={16} />
        </Button>
        <IndentSelector disabled={disabled}/>
        <LineHeightSelector disabled={disabled}/>
      </div>
      <div className={cn(styles.tool_group, styles.tool_others)}>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <SquareCheck size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Link size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Quote size={16} />
        </Button>
        <Button className={styles.tool_button} variant="ghost" disabled={disabled}>
          <Minus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
