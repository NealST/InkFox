import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const Empty = function() {

  const { t } = useTranslation();

  return (
    <div className={styles.empty}>
      <div className={styles.empty_welcome}>
        {t('welcomeText')}
      </div>
    </div>
  )
};

export default Empty;
