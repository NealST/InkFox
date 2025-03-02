import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  CircleEllipsis,
  Settings,
  House,
  GalleryHorizontalEnd,
  MonitorDown,
  MessageSquareShare,
} from "lucide-react";
import { emitter } from '@/utils/events';
import useAI from "../editor/use-ai";
import styles from "./index.module.css";

const actionList = [
  {
    id: "settings",
    icon: Settings,
  },
  {
    id: "introduction",
    icon: House,
  },
  {
    id: "changelog",
    icon: GalleryHorizontalEnd,
  },
  {
    id: "download",
    icon: MonitorDown,
  },
  {
    id: "feedback",
    icon: MessageSquareShare,
  },
];

const More = function () {
  const { t } = useTranslation();
  const { handleSubmit } = useAI();
  const strategies = {
    settings: () => {
      emitter.emit('openSettings');
    },
    introduction: () => {},
    changelog: () => {},
    download: () => {},
    feedback: () => {},
  };

  return (
    <div className={styles.more}>
      <HoverCard>
        <HoverCardTrigger className={styles.bar_trigger}>
          <Button className={styles.bar_more} variant="ghost">
            <CircleEllipsis />
            <span className={styles.more_text}>{t("more")}</span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="right">
          {actionList.map((item) => {
            const { id, icon: Icon } = item;
            return (
              <Button
                key={id}
                className={styles.action_item}
                variant="ghost"
                onClick={() => strategies[id as keyof typeof strategies]()}
              >
                <Icon />
                <span className={styles.action_text}>{t(id)}</span>
              </Button>
            );
          })}
          <Button onClick={handleSubmit}>测试AI</Button>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default More;
