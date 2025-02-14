import Cates from '../cates';
import Articles from '../articles';
import Logo from '@/assets/logo.png';
import More from '../more';
import styles from './index.module.css';

const SideBar = function() {

  function handleClickMore() {

  }
  
  return (
    <aside className={styles.side_bar}>
      <section className={styles.bar_cates}>
        <div className={styles.bar_logo}>
          <img className={styles.logo_img} src={Logo} alt='logo' />
        </div>
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
