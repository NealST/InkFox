import { useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { useTitle, type ITitleState } from "../content/title";
import styles from "./index.module.css";

const Header = function () {
  const selectedArticleName = useSelectedArticle(
    (state: IArticleState) => state.name
  );
  const latestTitle = useTitle((state: ITitleState) => state.title);
  const { t } = useTranslation();

  const actions = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <div className={styles.header}>
      <div className={styles.header_info}>
        <span className={styles.info_title}>
          {latestTitle || selectedArticleName}
        </span>
        <span className={styles.info_savetime}></span>
        <span className={styles.info_count}>{t("wordcount")}: 0</span>
      </div>
      <div className={styles.header_action}>
        {actions.map((item) => {
          const { id, Icon } = item;
          return (
            <TooltipProvider key={id}>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost">
                    <Icon size={24} />
                  </Button>
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
