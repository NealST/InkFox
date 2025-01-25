import {
  useContentState,
  type IContentState,
} from "../../controllers/datasource-state";
import {
  useSelectionRange,
  type ISelectionRange,
} from "../../controllers/selection-range";
import { getFormatedContentByRange } from "../../controllers/format";
import type { IBlockStateItem } from "../../content/blocks/types";

export const useFormatRange = function () {
  const selectionRange = useSelectionRange(
    (state: ISelectionRange) => state.range
  );
  const { dataSource, setDataSource } = useContentState(
    (state: IContentState) => state
  );

  return (formatCb: (child: IBlockStateItem) => IBlockStateItem) => {
    setDataSource(
      getFormatedContentByRange(dataSource, selectionRange, formatCb)
    );
  };
};

export const processStyle = function (
  oldStyle: string,
  newStyleItem: string,
  modeReg: RegExp
) {
  if (!oldStyle) {
    return newStyleItem;
  }
  if (modeReg.test(oldStyle)) {
    return oldStyle.replace(modeReg, newStyleItem);
  }
  return oldStyle + newStyleItem;
};

export const formatBold = function (child: IBlockStateItem) {
  return {
    ...child,
    style: processStyle(child.style || '', `font-weight:600;`, /font-weight:(.*?);/)
  };
};

export const formatItalic = function (child: IBlockStateItem) {
  return {
    ...child,
    style: processStyle(child.style || '', `font-style:italic;`, /font-style:(.*?);/)
  };
};

export const formatStrikeThrough = function (child: IBlockStateItem) {
  return {
    ...child,
    name: "del",
  };
};

export const formatUnderline = function (child: IBlockStateItem) {
  return {
    ...child,
    name: "underline",
  };
};

export const formatInlineCode = function (child: IBlockStateItem) {
  return {
    ...child,
    name: "code",
  };
};
