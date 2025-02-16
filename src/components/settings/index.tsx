"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

import { cn } from "@udecode/cn";
import { useEditorPlugin } from "@udecode/plate/react";
import { CopilotPlugin } from "@udecode/plate-ai/react";
import {
  ExternalLinkIcon,
  Eye,
  EyeOff,
  Settings,
  Wand2Icon,
  Upload,
  SunMoon,
  BookA,
  Type,
} from "lucide-react";

import { Button } from "@/components/plate-ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/plate-ui/dialog";
import { Input } from "@/components/plate-ui/input";
import { setTheme, type Theme } from '@/utils/set-theme';
import { useTranslation } from "react-i18next";
import { setConfig, getConfig } from "@/utils/store-config";
import i18n from "@/i18n";

export type Language = "en" | "zh";

interface Model {
  label: string;
  value: string;
}

interface ISettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ISettings {
  theme: Theme;
  language: Language;
  fontFamily: any;
  model: string;
  modelApiKey: string;
  uploadThingApiKey: string;
}

export const models: Model[] = [
  { label: "gpt-4o-mini", value: "gpt-4o-mini" },
  { label: "gpt-4o", value: "gpt-4o" },
  { label: "gpt-4-turbo", value: "gpt-4-turbo" },
  { label: "gpt-4", value: "gpt-4" },
  { label: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
  { label: "gpt-3.5-turbo-instruct", value: "gpt-3.5-turbo-instruct" },
];

const languages = [
  {
    label: 'English', value: 'en'
  },
  {
    label: '简体中文', value: 'zh'
  }
]

export const defaultSettings = {
  theme: "system" as Theme,
  language: (window.navigator.language === 'zh-CN' ? 'zh' : 'en') as Language,
  fontFamily: "",
  model: "",
  modelApiKey: "",
  uploadThingApiKey: "",
};

type SettingsProviderState = {
  settings: ISettings;
  setSettings: (config: ISettings) => void;
};

const initialState: SettingsProviderState = {
  settings: defaultSettings,
  setSettings: () => null,
};

export const SettingsProviderContext =
  createContext<SettingsProviderState>(initialState);

export const useSettings = () => {
  const context = useContext(SettingsProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export function SettingsDialog(props: ISettingsProps) {
  const { open, onOpenChange } = props;
  const { settings, setSettings } = useSettings();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const { t } = useTranslation();

  // const { getOptions, setOption } = useEditorPlugin(CopilotPlugin);

  const handleThemeChange = function (value: Theme) {
    setTheme(value);
    const newSettings = {
      ...settings,
      theme: value,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  const handleLanguageChange = function (value: Language) {
    i18n.changeLanguage(value);
    const newSettings = {
      ...settings,
      language: value,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  const handleFontChange = function (value: string) {
    const newSettings = {
      ...settings,
      fontFamily: value,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  const handleModelChange = function (value: string) {
    const newSettings = {
      ...settings,
      model: value,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  const handleModelApiKeyChange = function (value: string) {
    const newSettings = {
      ...settings,
      modelApiKey: value,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  const handleUploadApiKeyChange = function (value: string) {
    const newSettings = {
      ...settings,
      uploadThingApiKey: value,
    };
    setSettings(newSettings);
    setConfig(JSON.stringify(newSettings));
  };

  const toggleKeyVisibility = (key: string) => {
    setShowKey((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderApiKeyInput = (service: string, label: string) => {
    const defaultValue =
      settings[
        service === "ai" ? "modelApiKey" : "uploadThingApiKey"
      ];
    const handleChange =
      service === "ai" ? handleModelApiKeyChange : handleUploadApiKeyChange;
    return (
      <div className="group relative">
        <div className="flex items-center justify-between">
          <label
            className="absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
            htmlFor={label}
          >
            <span className="inline-flex bg-background px-2">{label}</span>
          </label>
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="absolute right-[28px] top-0 h-full"
          >
            <a
              className="flex items-center"
              href={
                service === "openai"
                  ? "https://platform.openai.com/api-keys"
                  : "https://uploadthing.com/dashboard"
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLinkIcon className="size-4" />
              <span className="sr-only">Get {label}</span>
            </a>
          </Button>
        </div>

        <Input
          id={label}
          className="pr-10"
          defaultValue={defaultValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder=""
          data-1p-ignore
          type={showKey[service] ? "text" : "password"}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
          onClick={() => toggleKeyVisibility(service)}
          type="button"
        >
          {showKey[service] ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
          <span className="sr-only">
            {showKey[service] ? "Hide" : "Show"} {label}
          </span>
        </Button>
      </div>
    );
  };

  const renderThemeMode = () => {
    return (
      <div className="group relative">
        <label
          className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50"
          htmlFor="select-theme"
        >
          {t("currentTheme")}
        </label>
        <Select
          defaultValue={settings.theme}
          onValueChange={handleThemeChange}
        >
          <SelectTrigger id="select-theme" className="w-full">
            <SelectValue className="w-full" role="combobox" />
          </SelectTrigger>
          <SelectContent className="w-full p-0">
            <SelectItem value="light">{t("lightTheme")}</SelectItem>
            <SelectItem value="dark">{t("darkTheme")}</SelectItem>
            <SelectItem value="system">{t("systemTheme")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderLanguageMode = () => {
    return (
      <div className="group relative">
        <label
          className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50"
          htmlFor="select-language"
        >
          {t("currentLanguage")}
        </label>
        <Select
          defaultValue={settings.language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger id="select-language" className="w-full">
            <SelectValue className="w-full" role="combobox" />
          </SelectTrigger>
          <SelectContent className="w-full p-0">
            {
              languages.map(item => {
                const { label, value } = item;
                return (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                )
              })
            }
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderFontFamilyMode = () => {
    return (
      <div className="group relative">
        <label
          className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50"
          htmlFor="select-fontfamily"
        >
          {t("currentFontFamily")}
        </label>
        <Select
          defaultValue={settings.fontFamily}
          onValueChange={handleFontChange}
        >
          <SelectTrigger id="select-fontfamily" className="w-full">
            <SelectValue className="w-full" role="combobox" />
          </SelectTrigger>
          <SelectContent className="w-full p-0">
            <SelectItem value="en">{t("en")}</SelectItem>
            <SelectItem value="ch">{t("ch")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderModel = () => {
    return (
      <div className="group relative">
        <label
          className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[:disabled]:opacity-50"
          htmlFor="select-model"
        >
          {t("model")}
        </label>
        <Select
          defaultValue={settings.language}
          onValueChange={handleModelChange}
        >
          <SelectTrigger id="select-model" className="w-full">
            <SelectValue className="w-full" role="combobox" />
          </SelectTrigger>
          <SelectContent className="w-full p-0">
            {models.map((item) => {
              const { label, value } = item;
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="default"
          className={cn(
            "group fixed bottom-4 right-4 z-50 size-10 overflow-hidden",
            "rounded-full shadow-md hover:shadow-lg",
            "transition-all duration-300 ease-in-out hover:w-[106px]"
          )}
          data-block-hide
        >
          <div className="flex size-full items-center justify-start gap-2">
            <Settings className="ml-1.5 size-4" />
            <span
              className={cn(
                "whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out",
                "group-hover:translate-x-0 group-hover:opacity-100",
                "-translate-x-2"
              )}
            >
              {t("settings")}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{t("settings")}</DialogTitle>
          <DialogDescription>{t("settingsTip")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-5">
          {/* theme Settings Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <SunMoon className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold">{t("theme")}</h4>
            </div>

            <div className="space-y-4">{renderThemeMode()}</div>
          </div>

          {/* language Settings Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                <BookA className="size-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold">{t("language")}</h4>
            </div>

            <div className="space-y-4">{renderLanguageMode()}</div>
          </div>

          {/* font family Settings Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Type className="size-4 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold">{t("fontFamily")}</h4>
            </div>

            <div className="space-y-4">{renderFontFamilyMode()}</div>
          </div>

          {/* AI Settings Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Wand2Icon className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold">AI</h4>
            </div>

            <div className="space-y-4">
              {renderModel()}
              {renderApiKeyInput("ai", "API key")}
            </div>
          </div>

          {/* Upload Settings Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-red-100 p-2 dark:bg-red-900">
                <Upload className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="font-semibold">{t("upload")}</h4>
            </div>

            <div className="space-y-4">
              {renderApiKeyInput("uploadthing", "Uploadthing API key")}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
