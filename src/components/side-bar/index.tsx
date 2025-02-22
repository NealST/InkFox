import Cates from '../cates';
import Articles from '../articles';
import More from '../more';
import styles from './index.module.css';

const SideBar = function() {
  
  return (
    <aside className={styles.side_bar}>
      <section className={styles.bar_cates}>
        <Cates />
        <More />
      </section>
      <section className={styles.bar_articles}>
        <Articles />
      </section>
    </aside>
  )

};

export default SideBar;
