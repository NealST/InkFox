// format markdown utils

import type { IBlockStateItem } from "../content/blocks/types";

const getStrongHtml = function (text: string) {
  return `<strong class="ink-content-item ink-strong">${text}</strong>`;
};

const getEmHtml = function (text: string) {
  return `<em class="ink-content-item ink-em">${text}</em>`;
};

const getInlineCodeHtml = function (text: string) {
  return `<code class="ink-content-item ink-inline-code">${text}</code>`;
};

const getImageHtml = function (imgUrl: string) {
  return `<img class="ink-content-item ink-image" src="${imgUrl}"></img>`;
};

const getLinkHtml = function (label: string, url: string) {
  return `<a class="ink-content-item ink-link" href="${url}">${label}</a>`;
};

const getPlainHtml = function (text: string) {
  return `<span class="ink-content-item ink-plain">${text}</span>`;
};

const getUnderlineHtml = function (text: string) {
  return `<u class="ink-content-item ink-underline">${text}</u>`;
};

const getMarkHtml = function (text: string) {
  return `<mark class="ink-content-item ink-mark">${text}</mark>`;
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
        name: 'underline',
        text: matches[1],
      };
    }
  },
  mark: {
    beginReg: /&lt;mark&gt;/,
    reg: /&lt;mark&gt;([^(&lt;)]+)&lt;\/mark&gt;/,
    toHtml(matches: RegExpMatchArray) {
      return getMarkHtml(matches[1]);
    },
    toState(matches: RegExpMatchArray) {
      return {
        name: 'mark',
        text: matches[1],
      };
    }
  }
};

export type RuleKeys = keyof typeof md2StateRules;

export const transfromChild2Html = function (child: IBlockStateItem) {
  const { name, text = "", url = "" } = child;
  let retHtml = "";
  switch (name) {
    case "strong":
      retHtml = getStrongHtml(text);
      break;
    case "em":
      retHtml = getEmHtml(text);
      break;
    case "plain":
      retHtml = getPlainHtml(text);
      break;
    case "underline":
      retHtml = getUnderlineHtml(text);
      break;
    case "mark":
      retHtml = getMarkHtml(text);
      break;
    case "link":
      retHtml = getLinkHtml(text, url);
      break;
    case "code":
      retHtml = getInlineCodeHtml(text);
      break;
    case "image":
      retHtml = getImageHtml(url);
      break;
  }
  return retHtml;
};

export const transformChildren2Html = function(children: IBlockStateItem[]) {
  if (children.length === 0) {
    return "";
  }
  return children
    .map((item) => {
      return transfromChild2Html(item);
    })
    .join("");
}

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
