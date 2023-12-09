/*
 * @Description:
 * @Author: Sunly
 * @Date: 2023-12-09 08:14:34
 */
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { useVesselModalStore } from "../../store/modal.store";
import { useVesselStore, type IVessel } from "../../store/vessel.store";
import { IVesselTemperature } from "../../utils/shared";

const BaseModal: React.FC = () => {
  const { isShowModal, modalType, modalData, setModalData, closeModal } =
    useVesselModalStore();
  const { addVessel, editVessel, removeVessel } = useVesselStore();

  const okText =
    modalType === "ADD" ? "添加" : modalType === "EDIT" ? "修改" : "删除";
  const title = `${okText}数据`;
  const isDel = modalType === "DEL";

  const handleClose = () => {
    closeModal();
  };

  const [msg, setMsg] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleOk = () => {
    if (
      (modalType === "ADD" || modalType === "EDIT") &&
      (!modalData.name || !modalData.volume)
    ) {
      setMsg({
        show: true,
        message: "请填写完整信息",
        type: "error",
      });
      return;
    }
    if (modalType === "DEL") {
      removeVessel(modalData.id);
      setMsg({
        show: false,
        message: "删除成功",
        type: "success",
      });
    } else if (modalType === "ADD") {
      addVessel(modalData);
      setMsg({
        show: false,
        message: "添加成功",
        type: "success",
      });
    } else if (modalType === "EDIT") {
      editVessel(modalData);
      setMsg({
        show: false,
        message: "修改成功",
        type: "success",
      });
    }

    closeModal();
  };

  const items: { [K in IVessel["temperature"]]: string } = {
    low: IVesselTemperature.low,
    high: IVesselTemperature.high,
  };

  return (
    <>
      <Snackbar
        open={msg.show}
        autoHideDuration={3000}
        onClose={() => setMsg({ ...msg, show: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setMsg({ ...msg, show: false })}
          severity="error"
          sx={{ width: "100%" }}
        >
          数据格式错误
        </Alert>
      </Snackbar>

      <Dialog
        open={isShowModal}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              required
              label="名称"
              variant="outlined"
              value={modalData.name}
              onChange={(e) => setModalData("name", e.target.value)}
              disabled={isDel}
            />

            <TextField
              fullWidth
              required
              label="体积"
              variant="outlined"
              value={modalData.volume}
              onChange={(e) => setModalData("volume", e.target.value)}
              disabled={isDel}
            />

            <DateTimePicker
              value={dayjs(modalData.time)}
              format="YYYY-MM-DD HH:mm:ss"
              label="时间"
              onChange={(e) => setModalData("time", e?.valueOf())}
              disabled={isDel}
            />

            <RadioGroup
              row
              name="controlled-radio-buttons-group"
              value={modalData.temperature}
              onChange={(e) => setModalData("temperature", e.target.value)}
            >
              {Object.entries(items).map(([key, value]) => (
                <FormControlLabel
                  value={key}
                  control={<Radio />}
                  label={value}
                  disabled={isDel}
                />
              ))}
            </RadioGroup>

            <TextField
              fullWidth
              label="备注"
              variant="outlined"
              value={modalData.remark}
              onChange={(e) => setModalData("remark", e.target.value)}
              disabled={isDel}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button
            onClick={handleOk}
            autoFocus
            color={isDel ? "error" : "primary"}
          >
            {okText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BaseModal;
