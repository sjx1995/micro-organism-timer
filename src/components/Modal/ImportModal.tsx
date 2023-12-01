/*
 * @Description: 导入数据模态框
 * @Author: Sunly
 * @Date: 2023-11-25 07:20:38
 */
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { IVesselTemperature, getPassTime } from "../../utils/shared";
import { useVesselStore } from "../../store/vessel.store";
import type { CheckboxChangeEvent, CheckboxOptionType } from "antd/es/checkbox";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import type { IImportVessels, IVessel } from "../../App";
import "./ImportModal.css";

const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

let vesselOptions: CheckboxOptionType[] = [];
let originVessel: IVessel[] = [];
const getExistVessel = (id: string, storeVessels: IVessel[]) =>
  storeVessels.findIndex((v) => v.id === id);
const createVesselOptions = (
  vesselData: IVessel[],
  storeVessels: IVessel[]
) => {
  originVessel = vesselData;
  vesselOptions = originVessel.map(
    ({ id, name, time, temperature, volume }) => ({
      label: `🏷️${name} 🫙${volume} 🌡️${
        temperature === "high"
          ? IVesselTemperature.high
          : IVesselTemperature.low
      } ⏱️${getPassTime(time)} ${
        getExistVessel(id, storeVessels) !== -1 ? "⚠有冲突" : ""
      }`,
      value: id,
    })
  );
};

const ImportModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onImport: IImportVessels;
}> = ({ visible, onClose, onImport }) => {
  const { vessels: storeVessels } = useVesselStore();

  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    onImport(
      originVessel.filter(({ id }) => checkedList.includes(id)),
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
      setCheckedList([]);
    } catch (error) {
      messageApi.error("数据格式错误");
    }
  };

  const [isCover, setCover] = useState(true);
  const onChangeCoverMode = (e: RadioChangeEvent) => {
    setCover(e.target.value);
  };

  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const checkAll = vesselOptions.length === checkedList.length;
  const showCheckAll = vesselOptions.length > 0;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < vesselOptions.length;
  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(
      e.target.checked ? vesselOptions.map(({ value }) => value) : []
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="解析并导入数据"
        open={visible}
        onOk={handleOk}
        okText="导入"
        okButtonProps={{ disabled: checkedList.length === 0 }}
        onCancel={handleCancel}
      >
        <Divider orientation="left">解析数据</Divider>
        <TextArea
          placeholder="将复制的数据粘贴到此处"
          autoSize={{ maxRows: 4, minRows: 4 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button className="parse-btn" onClick={handleParse}>
          解析
        </Button>

        <div style={{ display: showCheckAll ? "block" : "none" }}>
          <Divider orientation="left">导入的数据和原数据冲突时</Divider>
          <Radio.Group onChange={onChangeCoverMode} value={isCover}>
            <Radio value={true}>覆盖原数据</Radio>
            <Radio value={false}>保留两者</Radio>
          </Radio.Group>
          <Divider orientation="left">选择要导入的数据</Divider>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
          <CheckboxGroup
            options={vesselOptions}
            value={checkedList}
            onChange={onChange}
          />
        </div>
      </Modal>
    </>
  );
};

export default ImportModal;
