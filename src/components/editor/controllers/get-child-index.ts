// narrowing Note type to Element.
import getTextContent from "./get-text-content";

const getNodeOffsetInParagraph = function(
  node: Node,
  paragraph: HTMLElement
): number {
  let offset = 0;
  let preSibling: Node | null = node;

  if (node === paragraph) return offset;

  do {
    preSibling = preSibling.previousSibling;
    if (preSibling) {
      offset += getTextContent(preSibling, []).length;
    }
  } while (preSibling);

  return node === paragraph || node.parentNode === paragraph
    ? offset
    : offset + getNodeOffsetInParagraph(node.parentNode!, paragraph);
};

const getChildIndex = function(node: Node, paragraph: HTMLElement): number {
  if (node === paragraph) return 0;
  
  let index = 0;
  while(node.parentNode !== paragraph) {
    node = node.parentNode as Node;
  }
  let preSibling: Node | null = node;
  do {
    preSibling = preSibling.previousSibling;
    if (preSibling) {
      index += 1;
    }
  } while (preSibling);

  return index;
}

export default getChildIndex;
