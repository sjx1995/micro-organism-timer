/*
 * @Description: App
 * @Author: Sunly
 * @Date: 2023-11-17 06:29:30
 */
import React from "react";
import "./App.css";
import VesselModal from "./components/Modal/VesselModal";
import ToolBox from "./components/ToolBox/ToolBox";
import Vessel from "./components/Vessel/Vessel";
import { useVesselStore } from "./store/vessel.store";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const { vessels } = useVesselStore();

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <VesselModal />
          <ToolBox />
          {vessels
            .sort((a, b) => a.time - b.time)
            .map((vessel) => (
              <Vessel info={vessel} key={vessel.id} />
            ))}
        </main>
      </ThemeProvider>
    </div>
  );
};

export default App;
