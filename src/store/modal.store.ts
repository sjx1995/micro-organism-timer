/*
 * @Description: 容器操作弹窗状态
 * @Author: Sunly
 * @Date: 2023-12-01 07:59:48
 */
import { create } from "zustand";
import type { IVessel } from "./vessel.store";

export type IVesselModalType = "ADD" | "EDIT" | "DEL";

interface ModalStore {
  isShowModal: boolean;
  modalData: IVessel;
  setModalData: (key: keyof IVessel, value: unknown) => void;
  modalType: IVesselModalType;
  openAddVesselModal: () => void;
  openEditVesselModal: (data: IVessel) => void;
  openDelVesselModal: (data: IVessel) => void;
  closeModal: () => void;
}

const useVesselModalStore = create<ModalStore>((set) => ({
  isShowModal: false,
  toggleModal: () => set((state) => ({ isShowModal: !state.isShowModal })),

  modalData: {
    id: "",
    name: "",
    time: 0,
    volume: "",
    temperature: "low",
    remark: "",
  },
  setModalData: (key, value) => {
    return set((state) => ({
      modalData: { ...state.modalData, [key]: value },
    }));
  },

  modalType: "ADD",
  openAddVesselModal: () => {
    set(() => ({ modalType: "ADD" }));
    set(() => ({
      modalData: {
        id: "",
        name: "",
        time: Date.now(),
        volume: "",
        temperature: "low",
        remark: "",
      },
    }));
    set(() => ({ isShowModal: true }));
  },
  openEditVesselModal: (data) => {
    set(() => ({ modalType: "EDIT" }));
    set(() => ({ modalData: data }));
    set(() => ({ isShowModal: true }));
  },
  openDelVesselModal: (data) => {
    set(() => ({ modalType: "DEL" }));
    set(() => ({ modalData: data }));
    set(() => ({ isShowModal: true }));
  },
  closeModal: () => set(() => ({ isShowModal: false })),
}));

export { useVesselModalStore };
