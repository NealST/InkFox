import Title from "./title";
import cn from "classnames";
import {
  useContentState,
  type IContentState,
} from "../controllers/datasource-state";
import blockMap from "./blocks";
import {
  useToolbarDisabled,
  type IToolbarDisable,
} from "../controllers/toolbar-disable";
import {
  useSelectionRange,
  getSelectionRange,
  type ISelectionRange,
} from '../controllers/selection-range';
import styles from "./index.module.css";
import "github-markdown-css/github-markdown.css";

type BlockKey = keyof typeof blockMap;

const Content = function () {
  const dataSource = useContentState(
    (state: IContentState) => state.dataSource
  );
  const setToolbarDisabled = useToolbarDisabled(
    (state: IToolbarDisable) => state.setDisabled
  );
  const setSelectionRange = useSelectionRange((state: ISelectionRange) => state.setRange);

  function handleFocus() {
    setToolbarDisabled(false);
  }

  function handleMouseUp() {
    setSelectionRange(getSelectionRange());
  }

  return (
    <div className={styles.content}>
      <Title />
      <div
        className={cn(styles.content_body, "markdown-body")}
        onFocus={handleFocus}
        onMouseUp={handleMouseUp}
      >
        {dataSource.map((item, index) => {
          const { name, id } = item;
          const Com = blockMap[name as BlockKey];
          return <Com data={item} key={id} blockIndex={index} />;
        })}
      </div>
    </div>
  );
};

export default Content;
