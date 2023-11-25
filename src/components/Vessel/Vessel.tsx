/*
 * @Description: 培养皿信息组件
 * @Author: Sunly
 * @Date: 2023-11-17 07:44:11
 */
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Card } from "antd";
import { getPassTime } from "../../utils/shared";

import type { IChangeModalType, IVessel } from "../../App";

import "./Vessel.css";

const Vessel: React.FC<{
  info: IVessel;
  onShowModal: IChangeModalType;
}> = ({ info, onShowModal }) => {
  const { name, remark, temperature, time, volume } = info;

  const [passTime, setPassTime] = useState("");

  useEffect(() => {
    setPassTime(getPassTime(time));
    let timer = setInterval(() => {
      setPassTime(getPassTime(time));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [time]);

  return (
    <Card
      className="vessel-card"
      actions={[
        <div onClick={() => onShowModal("EDIT", { ...info })}>
          <Icon
            className="vessel-operate-icon"
            icon="material-symbols:edit-outline"
          />
        </div>,
        <div onClick={() => onShowModal("DEL", { ...info })}>
          <Icon
            className="vessel-operate-icon"
            icon="material-symbols:delete-outline"
          />
        </div>,
      ]}
    >
      <div className="vessel-title">
        {temperature === "high" ? (
          <Icon className="vessel-icon" icon="mdi:home-temperature-outline" />
        ) : (
          <Icon className="vessel-icon" icon="mingcute:snow-line" />
        )}
        <div className="vessel-name">{name}</div>
        <div className="vessel-volume">{volume}</div>
      </div>
      <div className="vessel-time">{passTime}</div>
      <div className="vessel-remark">{remark}</div>
    </Card>
  );
};

export default Vessel;
