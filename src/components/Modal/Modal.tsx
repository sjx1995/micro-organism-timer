/*
 * @Description: 模态框
 * @Author: Sunly
 * @Date: 2023-11-17 15:51:10
 */
import React, { type ReactNode } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Radio,
  type RadioChangeEvent,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

import type {
  IModalType,
  IChangeModalType,
  IVessel,
  ISetVesselData,
  ISetVesselDate,
  IReduceModalData,
} from "../../App";

const BaseItem: React.FC<{
  label: string;
  children: ReactNode;
}> = ({ label, children }) => (
  <div>
    <span>{label}</span>
    {children}
  </div>
);
const InputItem: React.FC<{
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, disabled, onChange }) => (
  <BaseItem label={label}>
    <Input
      placeholder={`请输入${label}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </BaseItem>
);
const DateSelectItem: React.FC<{
  label: string;
  value: Dayjs;
  onChange: (e: any) => void;
  disabled?: boolean;
}> = ({ label, value, onChange, disabled }) => (
  <BaseItem label={label}>
    <DatePicker
      format="YYYY年MM月DD日 HH时"
      value={value}
      onChange={onChange}
      showTime={{ defaultValue: dayjs() }}
      allowClear={false}
      disabled={disabled}
    />
  </BaseItem>
);
const RadioItem: React.FC<{
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (e: RadioChangeEvent) => void;
}> = ({ label, value, onChange, disabled }) => {
  const items: { [K in IVessel["temperature"]]: string } = {
    low: "4℃ 低温",
    high: "35℃ 室温",
  };
  return (
    <BaseItem label={label}>
      <Radio.Group onChange={onChange} value={value} disabled={disabled}>
        {Object.entries(items).map(([key, value]) => (
          <Radio value={key} key={key}>
            {value}
          </Radio>
        ))}
      </Radio.Group>
    </BaseItem>
  );
};

const BaseModal: React.FC<{
  onReduceModalData: IReduceModalData;
  onChangeModalType: IChangeModalType;
  onSetVesselData: ISetVesselData;
  onSetVesselDate: ISetVesselDate;
  type: IModalType;
  vessel: IVessel;
}> = ({
  onReduceModalData,
  onChangeModalType,
  onSetVesselData,
  onSetVesselDate,
  type,
  vessel,
}) => {
  const visible = type !== "HIDE";
  const okText =
    type === "ADD"
      ? "添加"
      : type === "EDIT"
      ? "修改"
      : type === "EXPORT"
      ? "导出"
      : type === "IMPORT"
      ? "导入"
      : "删除";
  const title = `${okText}数据`;
  const isDel = type === "DEL";

  const [messageApi, contextHolder] = message.useMessage();
  const handleOnOk = () => {
    if (
      (type === "ADD" || type === "EDIT") &&
      (!vessel.name || !vessel.volume)
    ) {
      messageApi.error("请填写完整信息");
      return;
    }
    onReduceModalData();
    onChangeModalType("HIDE");
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={title}
        okText={okText}
        open={visible}
        onOk={handleOnOk}
        onCancel={() => onChangeModalType("HIDE")}
        okType={isDel ? "danger" : "primary"}
      >
        <InputItem
          label="名称"
          value={vessel.name}
          onChange={(e) => onSetVesselData(e, "name")}
          disabled={isDel}
        />
        <InputItem
          label="体积"
          value={vessel.volume}
          onChange={(e) => onSetVesselData(e, "volume")}
          disabled={isDel}
        />
        <DateSelectItem
          label="时间"
          value={dayjs(vessel.time)}
          onChange={(e) => onSetVesselDate(e)}
          disabled={isDel}
        />
        <RadioItem
          label="温度"
          value={vessel.temperature}
          onChange={(e) => onSetVesselData(e, "temperature")}
          disabled={isDel}
        />
        <InputItem
          label="备注"
          value={vessel.remark}
          onChange={(e) => onSetVesselData(e, "remark")}
          disabled={isDel}
        />
      </Modal>
    </>
  );
};

export default BaseModal;
