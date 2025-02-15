import HeadLine from "./headline";
import Paragraph from "./paragraph";
import Quote from "./quote";
import List from './list';

const blockMap = {
  'heading': HeadLine,
  'paragraph': Paragraph,
  'quote': Quote,
  'list': List,
};

export default blockMap;
