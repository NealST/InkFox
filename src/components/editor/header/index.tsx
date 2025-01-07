import {
  useSelectedArticle,
  type IArticleState,
} from "@/components/articles/controllers/selected-article";
import { useTranslation } from "react-i18next";
import { Presentation, Focus, ArrowRightFromLine, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from "./index.module.css";

const Header = function () {
  const selectedArticleName = useSelectedArticle(
    (state: IArticleState) => state.name
  );
  const { t } = useTranslation();

  const actions = [
    {
      id: "presentation",
      Icon: Presentation,
    },
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
  ];

  return (
    <div className={styles.header}>
      <div className={styles.header_info}>
        <span className={styles.info_title}>{selectedArticleName}</span>
        <span className={styles.info_savetime}></span>
        <span className={styles.info_count}>{t("wordcount")}: 0</span>
      </div>
      <div className={styles.header_action}>
        {actions.map((item) => {
          const { id, Icon } = item;
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className={styles.action_item} key={id}>
                    <Icon style={{ color: "var(--font-color)" }} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t(id)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
