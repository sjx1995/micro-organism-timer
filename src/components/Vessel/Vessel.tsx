/*
 * @Description: 培养皿信息组件
 * @Author: Sunly
 * @Date: 2023-11-17 07:44:11
 */
import { Icon } from "@iconify/react";
import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { useVesselModalStore } from "../../store/modal.store";
import type { IVessel } from "../../store/vessel.store";
import { getPassTime } from "../../utils/shared";
import "./Vessel.css";

const Vessel: React.FC<{ info: IVessel }> = ({ info }) => {
  const { openDelVesselModal, openEditVesselModal } = useVesselModalStore();

  const { name, remark, temperature, time, volume } = info;

  const [passTime, setPassTime] = useState("");

  useEffect(() => {
    setPassTime(getPassTime(time));
    let timer = setInterval(() => {
      setPassTime(getPassTime(time));
    }, 60 * 10 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, [time]);

  return (
    <Card
      className={`vessel-card ${temperature}`}
      actions={[
        <div onClick={() => openEditVesselModal({ ...info })}>
          <Icon
            className="vessel-operate-icon"
            icon="material-symbols:edit-outline"
          />
        </div>,
        <div
          onClick={() => openDelVesselModal({ ...info })}
          className="vessel-del-btn"
        >
          <Icon
            className="vessel-operate-icon"
            icon="material-symbols:delete-outline"
          />
        </div>,
      ]}
    >
      {temperature === "high" ? (
        <Icon className="vessel-icon" icon="mdi:home-temperature-outline" />
      ) : (
        <Icon className="vessel-icon" icon="mingcute:snow-line" />
      )}
      <div className="vessel-title">
        <div className="vessel-name">{name}</div>
        <div className="vessel-volume">{volume}</div>
      </div>
      <div className="vessel-time">{passTime}</div>
      <div className="vessel-remark">{remark}</div>
    </Card>
  );
};

export default Vessel;
