import { useRef, RefObject, KeyboardEvent, useMemo } from "react";
import cn from "classnames";
import debounce from "@/utils/debounce";
import type { IBlockProps, IBlockStateItem } from "../types";
import getUpdatedState from "../../../controllers/update-block";
import {
  createParagraph
} from "../../../controllers/create-block";
import {
  transformChildren2Html,
  md2StateRules,
  getNewChildren,
  type RuleKeys,
} from "../../../controllers/format";
import {
  useContentState,
  type IContentState,
} from "../../../controllers/datasource-state";
import getKeyboardKey from "../../../controllers/get-keyborad-key";
import {
  useSelectionRange,
  ISelectionRange,
} from "../../../controllers/selection-range";
import { produce } from "immer";
import styles from "./index.module.css";

interface IParagraphProps extends IBlockProps {
  paragraphIndex?: number;
}

const Paragraph = function (props: IParagraphProps) {
  const { data, blockIndex, paragraphIndex } = props;
  const contentRef: RefObject<HTMLSpanElement> = useRef(null);
  const children = data.children || [];
  const { dataSource, setDataSource } = useContentState(
    (state: IContentState) => state
  );
  const selectionRange = useSelectionRange(
    (state: ISelectionRange) => state.range
  );
  const isBlock = paragraphIndex === undefined;
  const contentHtml = useMemo(
    () => transformChildren2Html(children),
    [children]
  );

  function updateParagraph(newParagraphData: IBlockStateItem) {
    let newBlockData: IBlockStateItem = newParagraphData;
    if (!isBlock) {
      newBlockData = produce(dataSource[blockIndex], (draft) => {
        // @ts-ignore
        draft.children[paragraphIndex] = newParagraphData;
      });
    }
    setDataSource(getUpdatedState(dataSource, newBlockData, blockIndex));
  }

  function createNewParagraph(
    insertIndex: number,
    initChildren: IBlockStateItem[] = []
  ) {
    if (!isBlock) {
      const newParagraphData = {
        name: "paragraph",
        children: initChildren,
      };
      const newBlockData = produce(dataSource[blockIndex], (draft) => {
        // @ts-ignore
        draft.children.splice(insertIndex, 0, newParagraphData);
      });
      setDataSource(getUpdatedState(dataSource, newBlockData, blockIndex));
      return;
    }
    setDataSource(createParagraph(dataSource, insertIndex, initChildren));
  }

  function createParagraphWithSplit(
    splitedChildren: IBlockStateItem[],
    insertedChildren: IBlockStateItem[]
  ) {
    if (!isBlock) {
      const newBlockData = produce(dataSource[blockIndex], (draft) => {
        // @ts-ignore
        draft.children[paragraphIndex].children = splitedChildren;
        // @ts-ignore
        draft.children.splice(paragraphIndex + 1, 0, {
          name: "paragraph",
          children: insertedChildren,
        });
      });
      setDataSource(getUpdatedState(dataSource, newBlockData, blockIndex));
      return;
    }
    const updatedDataSource = getUpdatedState(
      dataSource,
      {
        ...data,
        children: splitedChildren,
      },
      blockIndex
    );
    setDataSource(
      createParagraph(updatedDataSource, blockIndex + 1, insertedChildren)
    );
  }

  function checkForUpdate(content: string | undefined) {
    if (!content) {
      return "";
    }
    const { startChildIndex, startChildOffset } = selectionRange;
    const ruleKeys: Array<RuleKeys> = Object.keys(
      md2StateRules
    ) as Array<RuleKeys>;
    if (
      ruleKeys.some((item) => {
        const { beginReg, reg, toState } = md2StateRules[item];
        // if text matches the start rule, then end the execution.
        // in case that em is prior to strong when matching.
        if (beginReg.test(content)) {
          if (reg.test(content)) {
            const matches = content.match(reg);
            if (matches) {
              const stateItem = toState(matches);
              const newParagraphData = produce(data, (draft) => {
                draft.children = getNewChildren(
                  children,
                  {
                    childIndex: startChildIndex,
                    childOffset: startChildOffset,
                  },
                  stateItem
                );
              });
              updateParagraph(newParagraphData);
            }
          }
          return true;
        }
        return false;
      })
    ) {
      return;
    }

    // update the text content
    const childElement = contentRef.current?.children[startChildIndex];
    if (childElement) {
      const newChildText = childElement.textContent;
      const newParagraphData = produce(data, (draft) => {
        // @ts-ignore
        draft.children[startChildIndex].text = newChildText;
      });
      updateParagraph(newParagraphData);
    }
  }

  function handleInput() {
    checkForUpdate(contentRef.current?.innerHTML || "");
  }

  function handleKeydown(event: KeyboardEvent) {
    const pressKey = getKeyboardKey(event);
    if (pressKey === "Enter") {
      event.preventDefault();
      const { startChildIndex: childIndex, startChildOffset: childOffset } =
        selectionRange;
      const childState = children[childIndex];
      const { text } = childState;
      if (childOffset === text?.length) {
        if (childIndex === children.length - 1) {
          createNewParagraph((isBlock ? blockIndex : paragraphIndex) + 1);
          return;
        }
        const splitIndex = childIndex + 1;
        createParagraphWithSplit(
          children.slice(0, splitIndex),
          children.slice(splitIndex)
        );
        return;
      }

      if (childOffset === 0) {
        if (childIndex === 0) {
          createNewParagraph(isBlock ? blockIndex : paragraphIndex);
          return;
        }
        createParagraphWithSplit(
          children.slice(0, childIndex),
          children.slice(childIndex)
        );
        return;
      }

      const preAnchorText = text?.slice(0, childOffset);
      const afterAnchorText = text?.slice(childOffset);
      createParagraphWithSplit(
        children.slice(0, childIndex).concat({
          ...childState,
          text: preAnchorText,
        }),
        (
          [
            {
              ...childState,
              text: afterAnchorText,
            },
          ] as IBlockStateItem[]
        ).concat(children.slice(childIndex + 1))
      );
    }
  }

  return (
    <p className={cn(styles.paragraph, "paragraph")}>
      <span
        className={cn(
          styles.paragraph_content,
          "paragraph-content",
          isBlock ? "block-content" : ""
        )}
        ref={contentRef}
        role="doc-part"
        contentEditable
        onInput={debounce(handleInput)}
        onKeyDown={handleKeydown}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
        data-blockindex={blockIndex}
        data-paragraphindex={paragraphIndex}
      ></span>
    </p>
  );
};

export default Paragraph;
