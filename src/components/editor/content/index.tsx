import Title from './title';
import cn from 'classnames';
import {
    useContentState,
    type IContentState,
  } from "./controllers/datasource-state";
import blockMap from "./blocks";
import styles from './index.module.css';
import 'github-markdown-css/github-markdown.css';

type BlockKey = keyof typeof blockMap;

const Content = function() {
  const dataSource = useContentState((state: IContentState) => state.dataSource);

  return (
    <div className={styles.content}>
      <Title />
      <div className={cn(styles.content_body, 'markdown-body')}>
        {
          dataSource.map((item, index) => {
            const { name, id } = item;
            const Com = blockMap[name as BlockKey];
            return <Com data={item} key={id} index={index} />
          })
        }
      </div>
    </div>
  )
};

export default Content;
