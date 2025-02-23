'use client';

import React from 'react';

import { withRef } from '@udecode/cn';
import { useEditorRef } from '@udecode/plate/react';
import { indentListItems, unindentListItems } from '@udecode/plate-list';
import { IndentIcon, OutdentIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar';

export const ListIndentToolbarButton = withRef<
  typeof ToolbarButton,
  { reverse?: boolean }
>(({ reverse = false, ...rest }, ref) => {
  const editor = useEditorRef();
  const { t } = useTranslation();
  return (
    <ToolbarButton
      ref={ref}
      onClick={() => {
        reverse ? unindentListItems(editor) : indentListItems(editor);
      }}
      tooltip={t(reverse ? 'outdent' : 'indent')}
      {...rest}
    >
      {reverse ? <OutdentIcon /> : <IndentIcon />}
    </ToolbarButton>
  );
});
