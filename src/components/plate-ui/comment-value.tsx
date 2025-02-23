'use client';
import { cn } from '@udecode/cn';
import {
  CommentEditActions,
  CommentEditTextarea,
} from '@udecode/plate-comments/react';
import { useTranslation } from 'react-i18next';
import { buttonVariants } from './button';
import { inputVariants } from './input';

export function CommentValue() {
  const { t } = useTranslation();
  return (
    <div className="my-2 flex flex-col items-end gap-2">
      <CommentEditTextarea className={cn(inputVariants(), 'min-h-[60px]')} />

      <div className="flex space-x-2">
        <CommentEditActions.CancelButton
          className={buttonVariants({ size: 'xs', variant: 'outline' })}
        >
          {t('cancel')}
        </CommentEditActions.CancelButton>

        <CommentEditActions.SaveButton
          className={buttonVariants({ size: 'xs', variant: 'default' })}
        >
          {t('save')}
        </CommentEditActions.SaveButton>
      </div>
    </div>
  );
}
