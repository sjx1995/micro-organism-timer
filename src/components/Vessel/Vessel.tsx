/*
 * @Description: 培养皿信息组件
 * @Author: Sunly
 * @Date: 2023-11-17 07:44:11
 */
import { Icon } from "@iconify/react";
import {
  Button,
  CardHeader,
  Avatar,
  Card,
  CardActions,
  CardContent,
  Typography,
  colors,
} from "@mui/material";
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
    <Card className="vessel-card">
      <CardHeader
        avatar={
          temperature === "high" ? (
            <Avatar sx={{ bgcolor: colors.red["400"] }}>
              <Icon icon="mdi:home-temperature-outline" />
            </Avatar>
          ) : (
            <Avatar sx={{ bgcolor: colors.blue["400"] }}>
              <Icon icon="mingcute:snow-line" />
            </Avatar>
          )
        }
        title={name}
        titleTypographyProps={{ variant: "h6" }}
        subheader={volume}
      />

      <CardContent>
        <Typography variant="h5" gutterBottom>
          {passTime}
        </Typography>
        <Typography variant="body2" style={{ opacity: remark ? "0.5" : "0.2" }}>
          {remark || "暂无备注"}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => openEditVesselModal({ ...info })}>
          修改
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => openDelVesselModal({ ...info })}
        >
          删除
        </Button>
      </CardActions>
    </Card>
  );
};

export default Vessel;
