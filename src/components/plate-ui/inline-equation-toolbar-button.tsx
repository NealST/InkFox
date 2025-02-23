'use client';

import { useEditorRef, withRef } from '@udecode/plate/react';
import { insertInlineEquation } from '@udecode/plate-math';
import { RadicalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar';

export const InlineEquationToolbarButton = withRef<typeof ToolbarButton>(
  (props, ref) => {
    const editor = useEditorRef();
    const { t } = useTranslation();
    return (
      <ToolbarButton
        ref={ref}
        tooltip={t('markEquation')}
        {...props}
        onClick={() => {
          insertInlineEquation(editor);
        }}
      >
        <RadicalIcon />
      </ToolbarButton>
    );
  }
);
