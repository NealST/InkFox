import { useMemo } from "react";
import {
  useSelectedArticle,
  type IArticleState,
} from "@/components/articles/controllers/selected-article";
import { useTranslation } from "react-i18next";
import { Focus, ArrowRightFromLine, Trash2, Minimize } from "lucide-react";
import useTextCount from "../controllers/text-count";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from "@/components/plate-ui/dropdown-menu";
import { TooltipButton } from "@/components/plate-ui/tooltip";
import { emitter } from "@/utils/events";
import styles from "./index.module.css";

interface IProps {
  isFocusMode: boolean;
  onToggleFocusMode: (isFocusMode: boolean) => void;
}

const Header = function (props: IProps) {
  const { isFocusMode, onToggleFocusMode } = props;
  const openState = useOpenState();
  const selectedArticle = useSelectedArticle(
    (state: IArticleState) => state.selectedArticle
  );
  const { t } = useTranslation();
  const textCount = useTextCount((state) => state.count);
  const actions = useMemo(() => {
    const result = isFocusMode
      ? [
          {
            id: "unFocusmode",
            Icon: Minimize,
          },
        ]
      : [
          {
            id: "focusmode",
            Icon: Focus,
          },
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

  const displayedArticleName = selectedArticle.name.replace(".json", "");
  const actionStrategy = useMemo(
    () => ({
      focusmode: () => onToggleFocusMode(!isFocusMode),
      unFocusmode: () => onToggleFocusMode(!isFocusMode),
      export: (type: string) => {
        emitter.emit("export", {
          type,
          name: displayedArticleName
        });
      },
      delete: () => {},
    }),
    [isFocusMode, displayedArticleName]
  );

  return (
    <div className={styles.header}>
      <div className={styles.header_info}>
        <span className={styles.info_title}>{displayedArticleName}</span>
        <span className={styles.info_count}>
          {t("wordcount")}: {textCount}
        </span>
      </div>
      <div className={styles.header_action}>
        {actions.map((item) => {
          const { id, Icon } = item;
          const action = actionStrategy[id as keyof typeof actionStrategy];
          if (id === "export") {
            return (
              <DropdownMenu modal={false} {...openState} {...props} key={id}>
                <DropdownMenuTrigger asChild>
                  <TooltipButton
                    variant="ghost"
                    tooltip={t("export")}
                  >
                    <Icon size={24} />
                  </TooltipButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => action('html')}>
                      {t("export2Html")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => action('pdf')}>
                      {t("export2Pdf")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => action('image')}>
                      {t("export2Image")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => action('markdown')}>
                      {t("export2Markdown")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }
          return (
            <TooltipButton
              variant="ghost"
              tooltip={t(id)}
              key={id}
              onClick={() => action('done')}
            >
              <Icon size={24} />
            </TooltipButton>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
