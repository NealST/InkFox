'use client';
import { cn } from '@udecode/cn';
import {
  useCommentDeleteButton,
  useCommentDeleteButtonState,
  useCommentEditButton,
  useCommentEditButtonState,
} from '@udecode/plate-comments/react';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export function CommentMoreDropdown() {
  const editButtonState = useCommentEditButtonState();
  const { props: editProps } = useCommentEditButton(editButtonState);
  const deleteButtonState = useCommentDeleteButtonState();
  const { props: deleteProps } = useCommentDeleteButton(deleteButtonState);
  const { t } = useTranslation();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn('h-6 p-1 text-muted-foreground')}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem {...editProps}>{t('editComment')}</DropdownMenuItem>
          <DropdownMenuItem {...deleteProps}>{t('deleteComment')}</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
