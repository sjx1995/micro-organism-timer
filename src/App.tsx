/*
 * @Description: App
 * @Author: Sunly
 * @Date: 2023-11-17 06:29:30
 */
import React, { useState } from "react";
import { useLocalStorage } from "./hooks/useStorage";
import { v4 as uuid } from "uuid";
import Vessel from "./components/Vessel/Vessel";
import ToolBox from "./components/ToolBox/ToolBox";
import VesselModal from "./components/Modal/VesselModal";

import type { RadioChangeEvent } from "antd";
import type { Dayjs } from "dayjs";

import "./App.css";

import { useVesselStore } from "./store/vessel.store";

export type IVessel = {
  id: string;
  name: string;
  time: number;
  volume: string;
  temperature: "low" | "high";
  remark: string;
};
export type IAddVessel = (newVessel: Omit<IVessel, "id">) => void;
export type IEditVessel = (id: string, newVessel: IVessel) => void;
export type IDelVessel = (id: string) => void;
export type IChangeModalType = (type: IModalType, data?: IVessel) => void;

export type IModalType = "ADD" | "EDIT" | "DEL" | "IMPORT" | "EXPORT" | "HIDE";
export type ISetVesselData = <
  T extends React.ChangeEvent<HTMLInputElement> | RadioChangeEvent
>(
  e: T,
  key: keyof IVessel
) => void;
export type ISetVesselDate = (e: Dayjs) => void;
export type IReduceModalData = () => void;
export type IImportVessels = (newVessels: IVessel[], isCover: boolean) => void;

const App: React.FC = () => {
  const { vessels, addVessel, editVessel, removeVessel, importVessels } =
    useVesselStore();

  // const [vessels, setVessels] = useLocalStorage<IVessel[]>(
  //   VESSELS_STORAGE_NAME,
  //   []
  // );
  // const sortedVessels = vessels.sort((a, b) => a.time - b.time);

  const [modalType, setModalType] = useState<IModalType>("HIDE");
  const handleChangeModalType: IChangeModalType = (type, data?) => {
    if (type === "ADD") {
      setModalData({
        id: "",
        name: "",
        time: Date.now(),
        volume: "",
        temperature: "low",
        remark: "",
      });
    } else if (type === "EDIT" || type === "DEL") {
      setModalData(
        data
          ? { ...data }
          : {
              id: "",
              name: "",
              time: Date.now(),
              volume: "",
              temperature: "low",
              remark: "",
            }
      );
    }
    setModalType(type);
  };

  const [modalData, setModalData] = useState<IVessel>({
    id: "",
    name: "",
    time: Date.now(),
    volume: "",
    temperature: "low",
    remark: "",
  });
  const handleSetVesselData: ISetVesselData = (e, key) => {
    setModalData({ ...modalData, [key]: e.target.value });
  };
  const handleSetVesselDate: ISetVesselDate = (e) => {
    setModalData({ ...modalData, time: e.valueOf() });
  };
  const handleReduceModalData: IReduceModalData = () => {
    if (modalType === "ADD") {
      addVessel(modalData);
    } else if (modalType === "EDIT") {
      editVessel(modalData);
    } else if (modalType === "DEL") {
      removeVessel(modalData.id);
    }
  };

  const handleImportVessels: IImportVessels = (newVessels, isCover) => {
    importVessels(newVessels, isCover);
  };

  return (
    <div className="App">
      <VesselModal
        vessel={modalData}
        type={modalType}
        onChangeModalType={handleChangeModalType}
        onReduceModalData={handleReduceModalData}
        onSetVesselData={handleSetVesselData}
        onSetVesselDate={handleSetVesselDate}
      />
      <main>
        <ToolBox
          onChangeModalType={handleChangeModalType}
          vessels={vessels}
          onImportVessels={handleImportVessels}
        />
        {vessels.map((vessel) => (
          <Vessel
            info={vessel}
            key={vessel.id}
            onShowModal={handleChangeModalType}
          />
        ))}
      </main>
    </div>
  );
};

export default App;
