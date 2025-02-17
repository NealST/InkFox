import { mkdir, create, rename, remove } from "@tauri-apps/plugin-fs";
import type { IArticleItem } from "../types";

const updateDataSource = function (
  dataSource: IArticleItem[],
  parentPaths: number[],
  updateCb: (parentChildren: IArticleItem[], parentPath: string) => void,
  catePath = ""
) {
  const newDataSource = ([] as IArticleItem[]).concat(dataSource);
  let target = {
    children: newDataSource,
  };
  let parentPath = catePath;
  if (parentPaths.length > 0) {
    parentPaths.forEach((path) => {
      // @ts-ignore
      target = target.children[path];
      // @ts-ignore
      parentPath = target.path;
    });
  }
  updateCb(target.children, parentPath);
  return newDataSource;
};

export const appendChild = function (
  dataSource: IArticleItem[],
  itemPaths: number[],
  newItem: IArticleItem,
  catePath: string
) {
  // if newItem has an input action, it indicates that it's just need to change the display datasource
  const len = itemPaths.length;

  const { name, action, metadata } = newItem;
  const parentPaths = itemPaths.slice(0, len - 1);

  if (action === "input") {
    return updateDataSource(dataSource, parentPaths, (parentChildren) => {
      parentChildren.unshift(newItem);
    });
  }
  if (!name) {
    return updateDataSource(dataSource, parentPaths, (parentChildren) => {
      parentChildren.shift();
    });
  }

  return updateDataSource(
    dataSource,
    parentPaths,
    (parentChildren, parentPath) => {
      // call the file system async and update datasource optimisticly
      const path = `${parentPath}/${name}`;
      if (metadata.is_dir) {
        mkdir(path);
      } else {
        create(path);
      }
      const retNewItem = {
        ...newItem,
        path: path,
      };
      // if the first element is an input item
      if (parentChildren[0].action === 'input') {
        parentChildren[0] = retNewItem;
      } else {
        parentChildren.unshift(retNewItem);
      }
    },
    catePath
  );
};

export const renameChild = function (
  dataSource: IArticleItem[],
  itemPaths: number[],
  newItem: IArticleItem
) {
  const len = itemPaths.length;
  const parentPaths = itemPaths.slice(0, len - 1);
  const { path, action } = newItem;
  return updateDataSource(dataSource, parentPaths, (parentChildren) => {
    const itemIndex = itemPaths[len - 1];
    if (action !== "input") {
      // call the rename async
      rename(parentChildren[itemIndex].path, path);
    }
    parentChildren[itemIndex] = newItem;
  });
};

export const removeChild = function (
  dataSource: IArticleItem[],
  itemPaths: number[]
) {
  const len = itemPaths.length;
  const parentPaths = itemPaths.slice(0, len - 1);

  return updateDataSource(dataSource, parentPaths, (parentChildren) => {
    const itemIndex = itemPaths[len - 1];
    // call the remove async
    remove(parentChildren[itemIndex].path);

    parentChildren.slice(itemIndex, 1);
  });
};
