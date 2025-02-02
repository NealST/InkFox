import cn from "classnames";
import Paragraph from "../paragraph";
import type { IBlockProps, IBlockStateItem } from "../types";
import styles from "./index.module.css";

const Quote = function (props: IBlockProps) {
  const { blockIndex, data } = props;
  const children = data.children || [];

  return (
    <blockquote className={styles.quote}>
      <div
        className={cn(
          styles.quote_content,
          "block-content",
        )}
        data-blockindex={blockIndex}
      >
        {
          children.length > 0 && children.map((child: IBlockStateItem, index: number) => {
            return <Paragraph key={index} blockIndex={blockIndex} paragraphIndex={index} data={child} />
          })
        }
      </div>
    </blockquote>
  );
};

export default Quote;
