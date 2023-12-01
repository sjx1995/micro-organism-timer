/*
 * @Description: vessel store
 * @Author: Sunly
 * @Date: 2023-12-01 05:34:06
 */
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type IVessel = {
  id: string;
  name: string;
  time: number;
  volume: string;
  temperature: "low" | "high";
  remark: string;
};

interface VesselStore {
  vessels: IVessel[];
  addVessel: (vessel: IVessel) => void;
  editVessel: (vessel: IVessel) => void;
  removeVessel: (id: string) => void;
  importVessels: (vessels: IVessel[], isCover: boolean) => void;
}

const VESSELS_STORAGE_NAME = "__VESSELS_DATA";

const useVesselStore = create(
  persist<VesselStore>(
    (set, get) => ({
      vessels: get()?.vessels || [],
      addVessel: (vessel) =>
        set((state) => ({
          vessels: [...state.vessels, { ...vessel, id: uuid() }],
        })),
      editVessel: (vessel) =>
        set((state) => ({
          vessels: state.vessels.map((item) =>
            item.id === vessel.id ? vessel : item
          ),
        })),
      removeVessel: (id) =>
        set((state) => ({
          vessels: state.vessels.filter((item) => item.id !== id),
        })),
      importVessels: (vessels, isCover) =>
        set((state) => ({
          vessels: isCover
            ? [
                ...state.vessels.filter(
                  (vessel) => !vessels.some((item) => item.id === vessel.id)
                ),
                ...vessels,
              ]
            : [
                ...state.vessels,
                ...vessels.map((item) => ({
                  ...item,
                  id: state.vessels.some((vessel) => vessel.id === item.id)
                    ? uuid()
                    : item.id,
                })),
              ],
        })),
    }),
    {
      name: VESSELS_STORAGE_NAME,
    }
  )
);

export { useVesselStore };
