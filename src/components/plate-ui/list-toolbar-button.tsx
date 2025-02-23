'use client';

import React from 'react';

import { withRef } from '@udecode/cn';
import {
  BulletedListPlugin,
  useListToolbarButton,
  useListToolbarButtonState,
} from '@udecode/plate-list/react';
import { List, ListOrdered } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar';

export const ListToolbarButton = withRef<
  typeof ToolbarButton,
  {
    nodeType?: string;
  }
>(({ nodeType = BulletedListPlugin.key, ...rest }, ref) => {
  const state = useListToolbarButtonState({ nodeType });
  const { props } = useListToolbarButton(state);
  const { t } = useTranslation();
  return (
    <ToolbarButton
      ref={ref}
      tooltip={
        t(nodeType === BulletedListPlugin.key ? 'bulletedList' : 'orderedList')
      }
      {...props}
      {...rest}
    >
      {nodeType === BulletedListPlugin.key ? <List /> : <ListOrdered />}
    </ToolbarButton>
  );
});
