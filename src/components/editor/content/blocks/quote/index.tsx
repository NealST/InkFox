import { useRef, RefObject } from "react";
import cn from "classnames";
import debounce from "@/utils/debounce";
import getUpdatedState from "../../../controllers/update-block";
import {
  useContentState,
  type IContentState,
} from "../../../controllers/datasource-state";
import type { IBlockProps } from "../types";
import styles from "./index.module.css";

const Quote = function (props: IBlockProps) {
  const { index: blockIndex, data } = props;
  const contentRef: RefObject<HTMLSpanElement> = useRef(null);
  const { dataSource, setDataSource } = useContentState(
    (state: IContentState) => state
  );
  const text = data.text || "";

  function handleInput() {
    const contentDom = contentRef.current;
    if (!contentDom) {
      return;
    }
    const textContent = contentDom.textContent || "";
    if (textContent !== text) {
      setDataSource(
        getUpdatedState(
          dataSource,
          {
            name: "quote",
            text: textContent || "",
          },
          blockIndex
        )
      );
    }
  }

  function handleKeydown() {}

  return (
    <blockquote className={styles.quote}>
      <span
        className={cn(
          styles.quote_text,
          "block-content",
          `block-content-${blockIndex}`
        )}
        ref={contentRef}
        contentEditable
        onInput={debounce(handleInput)}
        onKeyDown={handleKeydown}
        dangerouslySetInnerHTML={{ __html: text }}
        data-blockindex={blockIndex}
      ></span>
    </blockquote>
  );
};

export default Quote;
