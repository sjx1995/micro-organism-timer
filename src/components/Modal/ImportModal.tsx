/*
 * @Description: 导入数据模态框
 * @Author: Sunly
 * @Date: 2023-11-25 07:20:38
 */
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useVesselStore, type IVessel } from "../../store/vessel.store";
import { IVesselTemperature, getPassTime } from "../../utils/shared";
import "./ImportModal.css";

let vesselOptions: { label: string; value: string }[] = [];
let originVessel: IVessel[] = [];
const getExistVessel = (id: string, storeVessels: IVessel[]) =>
  storeVessels.findIndex((v) => v.id === id);
const createVesselOptions = (
  vesselData: IVessel[],
  storeVessels: IVessel[]
) => {
  originVessel = vesselData.map((vessel) => ({
    ...vessel,
    id: vessel.id || uuid(),
  }));
  vesselOptions = originVessel.map(
    ({ id, name, time, temperature, volume }) => ({
      label: `🏷️${name} 🫙${volume} 🌡️${
        temperature === "high"
          ? IVesselTemperature.high
          : IVesselTemperature.low
      } ⏱️${getPassTime(time)} ${
        getExistVessel(id, storeVessels) !== -1 ? "⚠️有冲突" : ""
      }`,
      value: id,
    })
  );
};

const ImportModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const { vessels: storeVessels, importVessels } = useVesselStore();

  const [open, setOpen] = useState(false);

  const handleOk = () => {
    importVessels(
      originVessel.filter((_, i) => checkedList[i]),
      isCover
    );
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setText("");
      setCheckedList([]);
      vesselOptions = [];
    }
  }, [visible]);

  const [text, setText] = useState("");
  const handleParse = () => {
    try {
      createVesselOptions(JSON.parse(text), storeVessels);
      setCheckedList(new Array(vesselOptions.length).fill(false));
    } catch (error) {
      setOpen(true);
    }
  };

  const [isCover, setCover] = useState(true);

  const [checkedList, setCheckedList] = useState<boolean[]>([]);
  const showCheckAll = vesselOptions.length > 0;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const list = [...checkedList];
    list[i] = e.target.checked;
    setCheckedList(list);
  };
  const onCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedList(checkedList.map(() => e.target.checked));
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          数据格式错误
        </Alert>
      </Snackbar>

      <Dialog
        open={visible}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle>导入并解析数据</DialogTitle>
        <DialogContent>
          <Divider textAlign="left">
            <div style={{ margin: "8px 0" }}>解析数据</div>
          </Divider>

          <TextField
            fullWidth
            margin="normal"
            label="原始数据"
            multiline
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="将复制的数据粘贴到此处"
          />
          <Button className="parse-btn" onClick={handleParse}>
            解析
          </Button>

          <div style={{ display: showCheckAll ? "block" : "none" }}>
            <Divider textAlign="left">
              <div style={{ margin: "8px 0" }}>导入的数据和原数据冲突时</div>
            </Divider>

            <RadioGroup
              row
              name="controlled-radio-buttons-group"
              value={isCover}
              onChange={(e) => setCover(e.target.value === "true")}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label=" 覆盖原数据"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label=" 保留两者"
              />
            </RadioGroup>

            <Divider textAlign="left">
              <div style={{ margin: "8px 0" }}>选择要导入的数据</div>
            </Divider>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedList.every((v) => v)}
                    onChange={onCheckAll}
                  />
                }
                label="全选"
              />
              {vesselOptions.map(({ label, value }, i) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={checkedList[i]}
                      onChange={(e) => onChange(e, i)}
                    />
                  }
                  label={label}
                />
              ))}
            </FormGroup>
          </div>

          <DialogActions>
            <Button onClick={handleCancel}>取消</Button>{" "}
            <Button onClick={handleOk} disabled={checkedList.length === 0}>
              导入
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportModal;
