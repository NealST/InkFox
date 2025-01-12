export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

const getTextContent = function (node: Node, blackList: string[] = []) {
  if (node.nodeType === Node.TEXT_NODE || blackList.length === 0) {
    return node.textContent!;
  }

  let text = "";
  if (
    isElement(node) &&
    blackList.some(
      (className) => node.classList && node.classList.contains(className)
    )
  ) {
    return text;
  }

  const childNodes = node.childNodes;
  if (childNodes.length === 0) {
    return text;
  }

  for (const n of childNodes) {
    text += getTextContent(n, blackList);
  }
  return text;
};

export default getTextContent;
