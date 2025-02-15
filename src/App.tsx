import { useState, useEffect } from "react";
import SideBar from "./components/side-bar";
import CateInfoPanel from "./components/cate-info-panel";
import { ThemeProvider } from "./theme-provider";
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
    <ThemeProvider>
      <main className="main-container">
        <SideBar />
        <CateInfoPanel />
        <SettingsDialog open={openSettings} onOpenChange={setOpenSettings} />
      </main>
    </ThemeProvider>
  );
}

export default App;
