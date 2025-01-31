export interface IBlockStateItem {
  name: string;
  meta?: any;
  text?: string;
  url?: string;
  id?: string;
  style?: string;
  children?: IBlockStateItem[];
}

export interface IBlockProps {
  blockIndex: number;
  data: IBlockStateItem;
}
