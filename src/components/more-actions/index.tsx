import { Icon } from '@iconify/react';
import styles from './index.module.css';

const MoreActions = function() {
  return (
    <div className={styles.more_actions}>
      <Icon icon="fluent:more-circle-20-regular" width="20" height="20" />
      <span className={styles.actions_text}>更多</span>
    </div>
  )
};

export default MoreActions;
