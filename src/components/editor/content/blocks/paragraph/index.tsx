import { useRef, RefObject, MutableRefObject, KeyboardEvent } from "react";
import cn from "classnames";
import debounce from "@/utils/debounce";
import type { IBlockProps, IBlockStateItem } from "../types";
import getUpdatedState from "../../../controllers/update-block";
import { createParagraph } from "../../../controllers/create-block";
import {
  transformChildren2Html,
  md2StateRules,
  getNewChildren,
  type RuleKeys,
  type CursorInfo,
} from "../../../controllers/format";
import {
  useContentState,
  type IContentState,
} from "../../../controllers/datasource-state";
import getKeyboardKey from "../../../controllers/get-keyborad-key";
import { getSelectionRange } from '../../../controllers/selection-range';
import styles from "./index.module.css";

const Paragraph = function (props: IBlockProps) {
  const { data, index: blockIndex } = props;
  const contentRef: RefObject<HTMLSpanElement> = useRef(null);
  const children = data.children || [];
  const contentHtml = transformChildren2Html(children);
  const { dataSource, setDataSource } = useContentState(
    (state: IContentState) => state
  );
  const cursorRef: MutableRefObject<CursorInfo> = useRef({
    childIndex: 0,
    childOffset: 0
  });

  function checkForUpdate(content: string | undefined) {
    if (!content) {
      return "";
    }
    const ruleKeys: Array<RuleKeys> = Object.keys(
      md2StateRules
    ) as Array<RuleKeys>;
    ruleKeys.some((item) => {
      const { beginReg, reg, toState } = md2StateRules[item];
      // if text matches the start rule, then end the execution.
      // in case that em is prior to strong when matching.
      if (beginReg.test(content)) {
        if (reg.test(content)) {
          const matches = content.match(reg);
          if (matches) {
            const stateItem = toState(matches);
            setDataSource(
              getUpdatedState(
                dataSource,
                {
                  ...data,
                  children: getNewChildren(
                    children,
                    cursorRef.current,
                    stateItem
                  ),
                },
                blockIndex
              )
            );
          }
        }
        return true;
      }
      return false;
    });
  }

  function handleInput() {
    checkForUpdate(contentRef.current?.innerHTML || "");
  }

  function handleKeydown(event: KeyboardEvent) {
    const pressKey = getKeyboardKey(event);
    if (pressKey === "Enter") {
      event.preventDefault();
      const { childIndex, childOffset } = cursorRef.current;
      const childState = children[childIndex];
      const { text } = childState;
      if (childOffset === text?.length) {
        if (childIndex === children.length - 1) {
          setDataSource(createParagraph(dataSource, blockIndex + 1));
          return;
        }
        const splitIndex = childIndex + 1;
        const updatedDataSource = getUpdatedState(
          dataSource,
          {
            ...data,
            children: children.slice(0, splitIndex),
          },
          blockIndex
        );
        setDataSource(
          createParagraph(
            updatedDataSource,
            blockIndex + 1,
            children.slice(splitIndex)
          )
        );
        return;
      }

      if (childOffset === 0) {
        if (childIndex === 0) {
          setDataSource(createParagraph(dataSource, blockIndex));
          return;
        }
        const updatedDataSource = getUpdatedState(
          dataSource,
          {
            ...data,
            children: children.slice(0, childIndex),
          },
          blockIndex
        );
        setDataSource(
          createParagraph(
            updatedDataSource,
            blockIndex + 1,
            children.slice(childIndex)
          )
        );
        return;
      }

      const preAnchorText = text?.slice(0, childOffset);
      const afterAnchorText = text?.slice(childOffset);
      const updatedDataSource = getUpdatedState(
        dataSource,
        {
          ...data,
          children: children.slice(0, childIndex).concat({
            ...childState,
            text: preAnchorText,
          }),
        },
        blockIndex
      );
      setDataSource(
        createParagraph(
          updatedDataSource,
          blockIndex + 1,
          (
            [
              {
                ...childState,
                text: afterAnchorText,
              },
            ] as IBlockStateItem[]
          ).concat(children.slice(childIndex + 1))
        )
      );
    }
  }

  function handleClick() {
    const { startChildIndex, startChildOffset } = getSelectionRange();
    cursorRef.current = {
      childIndex: startChildIndex,
      childOffset: startChildOffset
    };
  }

  return (
    <p className={cn(styles.paragraph, "paragraph")}>
      <span
        className={cn(
          styles.paragraph_content,
          "block-content",
          `block-content-${blockIndex}`
        )}
        ref={contentRef}
        role="doc-part"
        contentEditable
        onInput={debounce(handleInput)}
        onKeyDown={handleKeydown}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
        data-blockindex={blockIndex}
      ></span>
    </p>
  );
};

export default Paragraph;
