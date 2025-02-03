import cn from "classnames";
import Paragraph from "../paragraph";
import type { IBlockProps, IBlockStateItem } from "../types";
import styles from "./index.module.css";

const List = function (props: IBlockProps) {
  const { data, blockIndex } = props;
  const type = data.meta.type;
  const children = data.children || [];
  const Tag = type as keyof JSX.IntrinsicElements;

  return (
    <Tag className={cn(styles.list, type === 'ol' ? styles.list_ol : styles.list_ul)}>
      {children.length > 0 &&
        children.map((child: IBlockStateItem, index: number) => {
          return (
            <li
              className={cn(styles.list_item, "list-item-content")}
              key={index}
              data-blockindex={blockIndex}
              data-paragraphindex={index}
            >
              <Paragraph
                blockIndex={blockIndex}
                paragraphIndex={index}
                data={child}
              />
            </li>
          );
        })}
    </Tag>
  );
};

export default List;
