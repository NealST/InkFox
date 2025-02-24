import { useMemo } from "react";
import {
  useSelectedArticle,
  type IArticleState,
} from "@/components/articles/controllers/selected-article";
import { useTranslation } from "react-i18next";
import { Focus, ArrowRightFromLine, Trash2, Minimize } from "lucide-react";
import useTextCount from "../controllers/text-count";
import { Button } from "@/components/ui/button";
import styles from "./index.module.css";

interface IProps {
  isFocusMode: boolean;
  onToggleFocusMode: (isFocusMode: boolean) => void;
}

const Header = function (props: IProps) {
  const { isFocusMode, onToggleFocusMode } = props;
  const selectedArticle = useSelectedArticle(
    (state: IArticleState) => state.selectedArticle
  );
  const { t } = useTranslation();
  const textCount = useTextCount((state) => state.count);
  const actions = useMemo(() => {
    const result = isFocusMode ? [
      {
        id: "unFocusmode",
        Icon: Minimize,
      }
    ] : [
      {
        id: "focusmode",
        Icon: Focus,
      }
    ];
    return result.concat([
      {
        id: "export",
        Icon: ArrowRightFromLine,
      },
      {
        id: "delete",
        Icon: Trash2,
      },
    ]);
  }, [isFocusMode]);
  
  const actionStrategy = {
    focusmode: () => onToggleFocusMode(!isFocusMode),
    unFocusmode: () => onToggleFocusMode(!isFocusMode),
    export: () => {},
    delete: () => {}
  }

  return (
    <div className={styles.header}>
      <div className={styles.header_info}>
        <span className={styles.info_title}>{selectedArticle.name}</span>
        <span className={styles.info_count}>
          {t("wordcount")}: {textCount}
        </span>
      </div>
      <div className={styles.header_action}>
        {actions.map((item) => {
          const { id, Icon } = item;
          return (
            <Button variant="ghost" title={t(id)} key={id} onClick={() => actionStrategy[id as keyof typeof actionStrategy]()}>
              <Icon size={24} />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
