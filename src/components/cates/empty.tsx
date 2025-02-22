import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const Empty = function() {
  
  const { t } = useTranslation();

  return (
    <div className={styles.empty}>
      {t('emptyCategories')}
    </div>
  )

};

export default Empty;
