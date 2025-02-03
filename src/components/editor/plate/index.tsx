import { usePlateEditor, Plate, PlateContent } from "@udecode/plate/react";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { HeadingPlugin } from "@udecode/plate-heading/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";

const value = [
  {
    type: "p",
    children: [
      {
        text: "This is editable plain text with react and history plugins, just like a <textarea>!",
      },
    ],
  },
];

const MyPlate = function () {
  const editor = usePlateEditor({
    plugins: [
      HeadingPlugin,
      BlockquotePlugin,
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
    ],
    value,
  });

  return (
    <Plate editor={editor}>
      <PlateContent />
    </Plate>
  );
};

export default MyPlate;
