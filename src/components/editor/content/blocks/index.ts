import HeadLine from "./headline";
import Paragraph from "./paragraph";
import Quote from "./quote";

const blockMap = {
  'heading': HeadLine,
  'paragraph': Paragraph,
  'quote': Quote,
};

export default blockMap;
