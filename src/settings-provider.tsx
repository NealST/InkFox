import { useLayoutEffect, useState } from "react";
import { getConfig } from './utils/store-config';
import type { ISettings } from './components/settings';
import { defaultSettings, SettingsProviderContext } from './components/settings';
import { setTheme, type Theme } from './utils/set-theme';
import i18n from "./i18n";

type ConfigProviderProps = {
  children: React.ReactNode
}

export function SettingsProvider({
  children
}: ConfigProviderProps) {
  const [settings, setSettings] = useState<ISettings>(defaultSettings);

  useLayoutEffect(() => {
    getConfig().then((config: ISettings) => {
      if (config.theme) {
        i18n.changeLanguage(config.language);
        setTheme(config.theme);
        setSettings(config);
      }
    });
  }, []);

  const value = {
    settings,
    setSettings,
  };

  return (
    <SettingsProviderContext.Provider value={value}>
      {children}
    </SettingsProviderContext.Provider>
  )
}
