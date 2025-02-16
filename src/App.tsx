import { useState, useEffect } from "react";
import SideBar from "./components/side-bar";
import CateInfoPanel from "./components/cate-info-panel";
import { SettingsProvider } from "./config-provider";
import { SettingsDialog } from "./components/settings";
import { emitter } from "@/utils/events";
import "./App.css";

function App() {
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const handleOpenSettings = () => {
      setOpenSettings(true);
    };
    emitter.on("openSettings", handleOpenSettings);
    return () => {
      emitter.off("openSettings", handleOpenSettings);
    };
  }, []);

  return (
    <SettingsProvider>
      <main className="main-container">
        <SideBar />
        <CateInfoPanel />
        <SettingsDialog open={openSettings} onOpenChange={setOpenSettings} />
      </main>
    </SettingsProvider>
  );
}

export default App;
