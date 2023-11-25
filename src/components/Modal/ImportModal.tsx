/*
 * @Description: 导入数据模态框
 * @Author: Sunly
 * @Date: 2023-11-25 07:20:38
 */
import React, { useEffect, useState } from "react";
import { Button, Modal, Checkbox, Divider, Input, message } from "antd";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { IVesselTemperature } from "./VesselModal";

import type { CheckboxChangeEvent, CheckboxOptionType } from "antd/es/checkbox";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import type { IImportVessels, IVessel } from "../../App";

import "./ImportModal.css";

const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

let vesselOptions: CheckboxOptionType[] = [];
let originVessel: IVessel[] = [];
const createVesselOptions = (vesselData: IVessel[]) => {
  console.log("create !!!");
  originVessel = vesselData.map((r) => ({
    ...r,
    id: uuid(),
  }));
  vesselOptions = originVessel.map(
    ({ id, name, time, temperature, volume }) => ({
      label: `${name} ${volume} ${
        temperature === "high"
          ? IVesselTemperature.high
          : IVesselTemperature.low
      } ${dayjs(time).format("YYYY年MM月DD日 HH时")}`,
      value: id,
    })
  );
};

const ImportModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onImport: IImportVessels;
}> = ({ visible, onClose, onImport }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    console.log(checkedList);
    console.log(originVessel);
    onImport(originVessel.filter(({ id }) => checkedList.includes(id)));
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setText("");
      vesselOptions = [];
    }
  }, [visible]);

  const [text, setText] = useState("");
  const handleParse = () => {
    try {
      createVesselOptions(JSON.parse(text));
      setCheckedList([]);
    } catch (error) {
      messageApi.error("数据格式错误");
    }
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
