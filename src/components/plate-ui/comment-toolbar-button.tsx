'use client';
import { useCommentAddButton } from '@udecode/plate-comments/react';
import { MessageSquarePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar';

export function CommentToolbarButton() {
  const { hidden, props } = useCommentAddButton();
  const { t } = useTranslation();
  if (hidden) return null;

  return (
    <ToolbarButton tooltip={t("commentShortup")} {...props}>
      <MessageSquarePlus />
    </ToolbarButton>
  );
}
