import { useMemo } from "react";
import {
  useSelectedArticle,
  type IArticleState,
} from "@/components/articles/controllers/selected-article";
import { useTranslation } from "react-i18next";
import { Focus, ArrowRightFromLine, Trash2 } from "lucide-react";
import useTextCount from "../controllers/text-count";
import { Button } from "@/components/ui/button";
import styles from "./index.module.css";

const Header = function () {
  const selectedArticle = useSelectedArticle(
    (state: IArticleState) => state.selectedArticle
  );
  const { t } = useTranslation();
  const textCount = useTextCount(state => state.count);
  const actions = useMemo(
    () => [
      {
        id: "focusmode",
        Icon: Focus,
      },
      {
        id: "export",
        Icon: ArrowRightFromLine,
      },
      {
        id: "delete",
        Icon: Trash2,
      },
    ],
    []
  );

  return (
    <div className={styles.header}>
      <div className={styles.header_info}>
        <span className={styles.info_title}>
          {selectedArticle.name}
        </span>
        <span className={styles.info_count}>{t("wordcount")}: {textCount}</span>
      </div>
      <div className={styles.header_action}>
        {actions.map((item) => {
          const { id, Icon } = item;
          return (
            <Button variant="ghost" title={t(id)} key={id}>
              <Icon size={24} />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
