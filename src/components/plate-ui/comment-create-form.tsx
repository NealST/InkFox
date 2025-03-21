'use client';
import { cn } from '@udecode/cn';
import { useEditorPlugin } from '@udecode/plate/react';
import {
  CommentNewSubmitButton,
  CommentNewTextarea,
  CommentsPlugin,
} from '@udecode/plate-comments/react';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from './button';
import { CommentAvatar } from './comment-avatar';
import { inputVariants } from './input';

export function CommentCreateForm() {
  const { useOption } = useEditorPlugin(CommentsPlugin);
  const { t } = useTranslation();
  const myUserId = useOption('myUserId');

  return (
    <div className="flex w-full space-x-2">
      <CommentAvatar userId={myUserId} />

      <div className="flex grow flex-col items-end gap-2">
        <CommentNewTextarea className={inputVariants()} />

        <CommentNewSubmitButton
          className={cn(buttonVariants({ size: 'sm' }), 'w-[90px]')}
        >
          {t('comment')}
        </CommentNewSubmitButton>
      </div>
    </div>
  );
}
