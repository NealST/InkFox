// format markdown utils

import type { IBlockStateItem } from "../content/blocks/types";
import type { IRange } from "./selection-range";
import { produce } from "immer";

const getStrongHtml = function (text: string, style = '') {
  return `<strong class="ink-content-item ink-strong" style="${style}">${text}</strong>`;
};

const getEmHtml = function (text: string, style = '') {
  return `<em class="ink-content-item ink-em" style="${style}">${text}</em>`;
};

const getInlineCodeHtml = function (text: string, style = '') {
  return `<code class="ink-content-item ink-inline-code" style="${style}">${text}</code>`;
};

const getImageHtml = function (imgUrl: string) {
  return `<img class="ink-content-item ink-image" src="${imgUrl}"></img>`;
};

const getLinkHtml = function (label: string, url: string, style = '') {
  return `<a class="ink-content-item ink-link" href="${url}" style="${style}">${label}</a>`;
};

const getPlainHtml = function (text: string, style = '') {
  return `<span class="ink-content-item ink-plain" style="${style}">${text}</span>`;
};

const getUnderlineHtml = function (text: string, style = '') {
  return `<u class="ink-content-item ink-underline" style="${style}">${text}</u>`;
};

const getMarkHtml = function (text: string, style = '') {
  return `<mark class="ink-content-item ink-mark" style="${style}">${text}</mark>`;
};

export const md2StateRules = {
  strong: {
    // can nest
    beginReg: /(\*\*|__)/,
    reg: /(\*\*|__)(?=\S)([\s\S]*?[^\s\\])(\\*)\1(?!(\*|_))/,
    toHtml(matches: RegExpMatchArray) {
      const theText = matches[2] || matches[3];
      return getStrongHtml(theText.trim());
    },
    toState(matches: RegExpMatchArray) {
      const theText = matches[2] || matches[3];
      return {
        name: "strong",
        text: theText.trim(),
      };
    },
  },
  em: {
    // can nest
    beginReg: /(\*|_)/,
    reg: /(\*|_)(?=\S)([\s\S]*?[^\s*\\])(\\*)\1(?!\1)/,
    toHtml(matches: RegExpMatchArray) {
      const theText = matches[2] || matches[3];
      return getEmHtml(theText.trim());
    },
    toState(matches: RegExpMatchArray) {
      const theText = matches[2] || matches[3];
      return {
        name: "em",
        text: theText.trim(),
      };
    },
  },
  inline_code: {
    beginReg: /`{1}([^`]+)/,
    reg: /(`{1,3})([^`]+|.{2,})\1/,
    toHtml(matches: RegExpMatchArray) {
      return getInlineCodeHtml(matches[2]);
    },
    toState(matches: RegExpMatchArray) {
      return {
        name: "code",
        text: matches[2],
      };
    },
  },
  image: {
    beginReg: /(!\[)(.*?)(\\*)\]\(/,
    reg: /(!\[)(.*?)(\\*)\]\((.*)(\\*)\)/,
    toHtml(matches: RegExpMatchArray) {
      return getImageHtml(matches[4]);
    },
    toState(matches: RegExpMatchArray) {
      return {
        name: "image",
        url: matches[4],
      };
    },
  },
  link: {
    // can nest
    beginReg: /(\[)((?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*?)(\\*)\]\(/,
    reg: /(\[)((?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*?)(\\*)\]\((.*)(\\*)\)/,
    toHtml(matches: RegExpMatchArray) {
      return getLinkHtml(matches[2], matches[4]);
    },
    toState(matches: RegExpMatchArray) {
      return {
        name: "link",
        text: matches[2],
        url: matches[4],
      };
    },
  },
  underline: {
    beginReg: /&lt;u&gt;/,
    reg: /&lt;u&gt;([^(&lt;)]+)&lt;\/u&gt;/,
    toHtml(matches: RegExpMatchArray) {
      return getUnderlineHtml(matches[1]);
    },
    toState(matches: RegExpMatchArray) {
      return {
        name: "underline",
        text: matches[1],
      };
    },
  },
  mark: {
    beginReg: /&lt;mark&gt;/,
    reg: /&lt;mark&gt;([^(&lt;)]+)&lt;\/mark&gt;/,
    toHtml(matches: RegExpMatchArray) {
      return getMarkHtml(matches[1]);
    },
    toState(matches: RegExpMatchArray) {
      return {
        name: "mark",
        text: matches[1],
      };
    },
  },
};

export type RuleKeys = keyof typeof md2StateRules;

export const transfromChild2Html = function (child: IBlockStateItem) {
  const { name, text = "", url = "", style } = child;
  let retHtml = "";
  switch (name) {
    case "strong":
      retHtml = getStrongHtml(text, style);
      break;
    case "em":
      retHtml = getEmHtml(text, style);
      break;
    case "plain":
      retHtml = getPlainHtml(text, style);
      break;
    case "underline":
      retHtml = getUnderlineHtml(text, style);
      break;
    case "mark":
      retHtml = getMarkHtml(text, style);
      break;
    case "link":
      retHtml = getLinkHtml(text, url, style);
      break;
    case "code":
      retHtml = getInlineCodeHtml(text, style);
      break;
    case "image":
      retHtml = getImageHtml(url);
      break;
  }
  return retHtml;
};

export const transformChildren2Html = function (children: IBlockStateItem[]) {
  if (children.length === 0) {
    return "";
  }
  return children
    .map((item) => {
      return transfromChild2Html(item);
    })
    .join("");
};

export type CursorInfo = {
  childIndex: number;
  childOffset: number;
};

export const getNewChildren = function (
  oldChildren: IBlockStateItem[],
  cursorInfo: CursorInfo,
  newState: IBlockStateItem
) {
  const { childIndex, childOffset } = cursorInfo;
  const newChildren = ([] as IBlockStateItem[]).concat(oldChildren);
  // at the start position
  if (childOffset === 0) {
    newChildren.splice(childIndex, 0, newState);
    return newChildren;
  }
  const childState = oldChildren[childIndex];
  const { text } = childState;
  // at the end position
  if (childOffset === text?.length) {
    newChildren.splice(childIndex + 1, 0, newState);
    return newChildren;
  }
  // at the middle position
  const preAnchorStr = text?.slice(0, childOffset);
  const afterAnchorStr = text?.slice(childOffset);
  const preAnchorState = {
    ...childState,
    text: preAnchorStr,
  };
  const afterAnchorState = {
    ...childState,
    text: afterAnchorStr,
  };
  // in case the nested children, flatten the children is better
  newChildren.splice(childIndex, 1, preAnchorState, newState, afterAnchorState);
  return newChildren;
};

export const getFormatedContentByRange = function (
  dataSource: IBlockStateItem[],
  range: IRange,
  formatCb: (child: IBlockStateItem) => IBlockStateItem
) {
  const {
    startBlockIndex,
    startChildIndex,
    startChildOffset,
    endBlockIndex,
    endChildIndex,
    endChildOffset,
    isCollapsed,
  } = range;
  if (isCollapsed) {
    return dataSource;
  }
  const newDataSource = produce(dataSource, (draft) => {
    const startBlock = draft[startBlockIndex];
    const startChild = startBlock.children?.[startChildIndex];
    const startChildText = startChild?.text;
    const endBlock = draft[endBlockIndex];
    const endChild = endBlock.children?.[endChildIndex];
    const endChildText = endChild?.text;
    const isStartAtBoundary =
      startChildOffset === 0 || startChildOffset === startChildText?.length;
    const isEndAtBoundary =
      endChildOffset === 0 || endChildOffset === endChildText?.length;
    // if format happens in the same block
    if (startBlockIndex === endBlockIndex) {
      if (startChildIndex === endChildIndex) {
        if (
          startChildOffset === 0 &&
          endChildOffset === startChildText?.length
        ) {
          // @ts-ignore
          draft[startBlockIndex].children[startChildIndex] =
            // @ts-ignore
            formatCb(startChild);
          return;
        }
        if (startChildOffset === 0) {
          // @ts-ignore
          draft[startBlockIndex].children[startChildIndex] = formatCb({
            // @ts-ignore
            name: startChild?.name,
            text: startChildText?.slice(startChildOffset, endChildOffset),
          });
          draft[startBlockIndex].children?.splice(startChildIndex + 1, 0, {
            // @ts-ignore
            name: startChild?.name,
            text: startChildText?.slice(endChildOffset),
          });
          return;
        }
        if (endChildOffset === startChildText?.length) {
          // @ts-ignore
          draft[startBlockIndex].children[startChildIndex] = {
            // @ts-ignore
            name: startChild?.name,
            text: startChildText?.slice(0, startChildOffset),
          };
          draft[startBlockIndex].children?.splice(
            startChildIndex + 1,
            0,
            formatCb({
              // @ts-ignore
              name: startChild?.name,
              text: startChildText?.slice(startChildOffset, endChildOffset),
            })
          );
          return;
        }
        // @ts-ignore
        draft[startBlockIndex].children[startChildIndex] = {
          // @ts-ignore
          name: startChild?.name,
          text: startChildText?.slice(0, startChildOffset),
        };
        draft[startBlockIndex].children?.splice(
          startChildIndex + 1,
          0,
          formatCb({
            // @ts-ignore
            name: startChild?.name,
            text: startChildText?.slice(startChildOffset, endChildOffset),
          })
        );
        draft[startBlockIndex].children?.splice(startChildIndex + 2, 0, {
          // @ts-ignore
          name: startChild?.name,
          text: startChildText?.slice(endChildOffset),
        });
        return;
      }
      if (isStartAtBoundary && isEndAtBoundary) {
        const leftChildIndex =
          startChildOffset === 0 ? startChildIndex : startChildIndex + 1;
        const rightChildIndex =
          endChildOffset === 0 ? endChildIndex - 1 : endChildIndex;
        for (let i = leftChildIndex; i <= rightChildIndex; i++) {
          // @ts-ignore
          draft[startBlockIndex].children[i] = formatCb(
            // @ts-ignore
            draft[startBlockIndex].children[i]
          );
        }
        return;
      }
      if (isStartAtBoundary) {
        const leftChildIndex =
          startChildOffset === 0 ? startChildIndex : startChildIndex + 1;
        for (let i = leftChildIndex; i < endChildIndex; i++) {
          // @ts-ignore
          draft[startBlockIndex].children[i] = formatCb(
            // @ts-ignore
            draft[startBlockIndex].children[i]
          );
        }
        // @ts-ignore
        draft[startBlockIndex].children[endChildIndex] = formatCb({
          // @ts-ignore
          name: endChild?.name,
          text: endChildText?.slice(0, endChildOffset),
        });
        draft[startBlockIndex].children?.splice(endChildIndex + 1, 0, {
          // @ts-ignore
          name: endChild?.name,
          text: endChildText?.slice(endChildOffset),
        });
        return;
      }
      if (isEndAtBoundary) {
        const rightChildIndex =
          endChildOffset === 0 ? endChildIndex - 1 : endChildIndex;
        for (let i = startChildIndex + 1; i <= rightChildIndex; i++) {
          // @ts-ignore
          draft[startBlockIndex].children[i] = formatCb(
            // @ts-ignore
            draft[startBlockIndex].children[i]
          );
        }
        // @ts-ignore
        draft[startBlockIndex].children[startChildIndex] = {
          // @ts-ignore
          name: startChild?.name,
          text: startChildText?.slice(0, startChildOffset),
        };
        draft[startBlockIndex].children?.splice(
          startChildIndex + 1,
          0,
          formatCb({
            // @ts-ignore
            name: startChild?.name,
            text: startChildText?.slice(startChildOffset),
          })
        );
        return;
      }
      if (endChildIndex - startChildIndex > 1) {
        const leftChildIndex = startChildIndex + 1;
        const rightChildIndex = endChildIndex - 1;
        for (let i = leftChildIndex; i <= rightChildIndex; i++) {
          // @ts-ignore
          draft[startBlockIndex].children[i] = formatCb(
            // @ts-ignore
            draft[startBlockIndex].children[i]
          );
        }
      }
      // @ts-ignore
      draft[startBlockIndex].children[startChildIndex] = {
        // @ts-ignore
        name: startChild?.name,
        text: startChildText?.slice(0, startChildOffset),
      };
      draft[startBlockIndex].children?.splice(
        startChildIndex + 1,
        0,
        formatCb({
          // @ts-ignore
          name: startChild?.name,
          text: startChildText?.slice(startChildOffset),
        })
      );
      // @ts-ignore
      draft[startBlockIndex].children[endChildIndex + 1] = formatCb({
        // @ts-ignore
        name: endChild?.name,
        text: endChildText?.slice(0, endChildOffset),
      });
      draft[startBlockIndex].children?.splice(endChildIndex + 2, 0, {
        // @ts-ignore
        name: endChild?.name,
        text: endChildText?.slice(endChildOffset),
      });
      return;
    }
    if (endBlockIndex - startBlockIndex > 1) {
      const leftBlockIndex = startBlockIndex + 1;
      const rightBlockIndex = endBlockIndex - 1;
      for (let i = leftBlockIndex; i <= rightBlockIndex; i++) {
        const theBlock = draft[i];
        if (!theBlock.children) {
          continue;
        }
        for (let j = 0; j < theBlock.children.length; j++) {
          // @ts-ignore
          draft[i].children[j] = formatCb(draft[i].children[j]);
        }
      }
    }
    if (!startBlock.children && !endBlock.children) {
      return;
    }
    const startChildrenLen = startBlock.children?.length;
    const formatStartChildIndex = startChildIndex + 1;
    // @ts-ignore
    if (formatStartChildIndex <= startChildrenLen - 1) {
      // @ts-ignore
      for (let i = formatStartChildIndex; i < startChildrenLen; i++) {
        // @ts-ignore
        draft[startBlockIndex].children[i] = formatCb(
          // @ts-ignore
          draft[startBlockIndex].children[i]
        );
      }
    }
    if (startChildOffset === 0) {
      // @ts-ignore
      draft[startBlockIndex].children[startChildIndex] = formatCb(
        // @ts-ignore
        draft[startBlockIndex].children[startChildIndex]
      );
    }
    // @ts-ignore
    if (startChildOffset > 0 && startChildOffset < startChildText?.length) {
      // @ts-ignore
      draft[startBlockIndex].children[startChildIndex] = {
        // @ts-ignore
        name: startChild?.name,
        text: startChildText?.slice(0, startChildOffset),
      };
      draft[startBlockIndex].children?.splice(
        startChildIndex + 1,
        0,
        formatCb({
          // @ts-ignore
          name: startChild?.name,
          text: startChildText?.slice(startChildOffset),
        })
      );
    }

    const formatEndChildIndex = endChildIndex - 1;
    // @ts-ignore
    if (formatEndChildIndex >= 0) {
      // @ts-ignore
      for (let i = 0; i <= formatEndChildIndex; i++) {
        // @ts-ignore
        draft[endBlockIndex].children[i] = formatCb(
          // @ts-ignore
          draft[endBlockIndex].children[i]
        );
      }
    }
    if (endChildOffset === endChildText?.length) {
      // @ts-ignore
      draft[endBlockIndex].children[endChildIndex] = formatCb(
        // @ts-ignore
        draft[endBlockIndex].children[endChildIndex]
      );
    }
    // @ts-ignore
    if (endChildOffset > 0 && endChildOffset < endChildText?.length) {
      // @ts-ignore
      draft[endBlockIndex].children[endChildIndex] = formatCb({
        // @ts-ignore
        name: endChild?.name,
        text: endChildText?.slice(0, endChildOffset),
      });
      draft[endBlockIndex].children?.splice(endChildIndex + 1, 0, {
        // @ts-ignore
        name: endChild?.name,
        text: endChildText?.slice(endChildOffset),
      });
    }
  });
  return newDataSource;
};
