import { useRef, RefObject, KeyboardEvent } from "react";
import type { IBlockProps } from "../types";
import getUpdatedState from "../../controllers/update-block";
import {
  useContentState,
  type IContentState,
} from "../../controllers/datasource-state";
import getKeyboardKey from "../../controllers/get-keyborad-key";
import { createHeading, createParagraph } from "../../controllers/create-block";
import cn from "classnames";
import debounce from "@/utils/debounce";
import styles from "./index.module.css";

const prefixReg = /^(\#*)/;
const modeReg = /^(\#+)(\s+)([^\#]*)/;

const HeadLine = function (props: IBlockProps) {
  const { index: blockIndex, data } = props;
  const contentRef: RefObject<HTMLSpanElement> = useRef(null);
  const { dataSource, setDataSource } = useContentState(
    (state: IContentState) => state
  );
  const level = data.meta.level;
  const text = data.text?.replace(prefixReg, "").trim() || "";

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  function handleInput() {
    const contentDom = contentRef.current;
    if (!contentDom) {
      return;
    }
    const textContent = contentDom.textContent || "";
    if (modeReg.test(textContent)) {
      const modeMatch = textContent.match(modeReg);
      const theLevel = modeMatch?.[1].length;
      if (theLevel !== level) {
        setDataSource(
          getUpdatedState(
            dataSource,
            {
              name: "heading",
              meta: {
                level: theLevel,
              },
              text: textContent || "",
            },
            blockIndex
          )
        );
        return;
      }
    }

    if (textContent !== text) {
      setDataSource(
        getUpdatedState(
          dataSource,
          {
            name: "heading",
            meta: {
              level,
            },
            text: textContent || "",
          },
          blockIndex
        )
      );
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    const pressKey = getKeyboardKey(event);
    const contentDom = contentRef.current;
    if (!contentDom) {
      return;
    }
    const textContent = contentDom.textContent;
    const { anchorOffset } = document.getSelection() as Selection;
    const curContentLen = textContent?.length;
    if (pressKey === "Enter") {
      event.preventDefault();
      if (anchorOffset === 0) {
        console.log("start blockIndex", blockIndex);
        setDataSource(createParagraph(dataSource, blockIndex));
        return;
      }
      if (anchorOffset === curContentLen) {
        console.log("end blockIndex", blockIndex);
        setDataSource(createParagraph(dataSource, blockIndex + 1));
        return;
      }
      const preAnchorText = textContent?.slice(0, anchorOffset);
      const afterAnchorText = textContent?.slice(anchorOffset);
      const updatedDataSource = getUpdatedState(
        dataSource,
        {
          name: "heading",
          meta: {
            level,
          },
          text: preAnchorText,
        },
        blockIndex
      );
      setDataSource(
        createHeading(updatedDataSource, blockIndex + 1, level, afterAnchorText)
      );
    }
  }

  return (
    <Tag className={cn(styles.headline, "atx-heading")}>
      <span
        className={styles.headline_text}
        ref={contentRef}
        role="heading"
        aria-level={level}
        contentEditable
        onInput={debounce(handleInput)}
        onKeyDown={handleKeydown}
      >
        {text}
      </span>
    </Tag>
  );
};

export default HeadLine;
