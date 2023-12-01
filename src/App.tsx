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

const App: React.FC = () => {
  const { vessels } = useVesselStore();

  return (
    <div className="App">
      <VesselModal />
      <main>
        <ToolBox />
        {vessels
          .sort((a, b) => a.time - b.time)
          .map((vessel) => (
            <Vessel info={vessel} key={vessel.id} />
          ))}
      </main>
    </div>
  );
};

export default App;
