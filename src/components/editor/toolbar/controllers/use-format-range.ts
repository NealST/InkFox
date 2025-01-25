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

export const formatBold = function (child: IBlockStateItem) {
  return {
    ...child,
    name: "strong",
  };
};

export const formatItalic = function (child: IBlockStateItem) {
  return {
    ...child,
    name: "em",
  };
};

export const formatStrikeThrough = function (child: IBlockStateItem) {
  return {
    ...child,
    name: "del",
  };
};

export const formatUnderline = function(child: IBlockStateItem) {
  return {
    ...child,
    name: 'underline'
  }
}

export const formatInlineCode = function(child: IBlockStateItem) {
  return {
    ...child,
    name: 'code'
  }
}
