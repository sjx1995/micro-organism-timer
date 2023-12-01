/*
 * @Description: 模态框
 * @Author: Sunly
 * @Date: 2023-11-17 15:51:10
 */
import {
  DatePicker,
  Input,
  Modal,
  Radio,
  message,
  type RadioChangeEvent,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { type ReactNode } from "react";
import { useVesselModalStore } from "../../store/modal.store";
import { useVesselStore, type IVessel } from "../../store/vessel.store";
import { IVesselTemperature } from "../../utils/shared";
import "./VesselModal.css";

const BaseItem: React.FC<{
  label: string;
  children: ReactNode;
}> = ({ label, children }) => (
  <div className="setting-item">
    <div className="label">{label}</div>
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
    low: IVesselTemperature.low,
    high: IVesselTemperature.high,
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

const BaseModal: React.FC = () => {
  const { isShowModal, modalType, modalData, setModalData, closeModal } =
    useVesselModalStore();
  const { addVessel, editVessel, removeVessel } = useVesselStore();

  const [messageApi, contextHolder] = message.useMessage();

  const okText =
    modalType === "ADD" ? "添加" : modalType === "EDIT" ? "修改" : "删除";
  const title = `${okText}数据`;
  const isDel = modalType === "DEL";

  const handleOnOk = () => {
    if (
      (modalType === "ADD" || modalType === "EDIT") &&
      (!modalData.name || !modalData.volume)
    ) {
      messageApi.error("请填写完整信息");
      return;
    }
    if (modalType === "DEL") {
      removeVessel(modalData.id);
      messageApi.success("删除成功");
    } else if (modalType === "ADD") {
      addVessel(modalData);
      messageApi.success("添加成功");
    } else if (modalType === "EDIT") {
      editVessel(modalData);
      messageApi.success("修改成功");
    }

    closeModal();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={title}
        okText={okText}
        open={isShowModal}
        onOk={handleOnOk}
        onCancel={closeModal}
        okType={isDel ? "danger" : "primary"}
      >
        <InputItem
          label="名称"
          value={modalData.name}
          onChange={(e) => setModalData("name", e.target.value)}
          disabled={isDel}
        />
        <InputItem
          label="体积"
          value={modalData.volume}
          onChange={(e) => setModalData("volume", e.target.value)}
          disabled={isDel}
        />
        <DateSelectItem
          label="时间"
          value={dayjs(modalData.time)}
          onChange={(e: Dayjs) => setModalData("time", e.valueOf())}
          disabled={isDel}
        />
        <RadioItem
          label="温度"
          value={modalData.temperature}
          onChange={(e) => setModalData("temperature", e.target.value)}
          disabled={isDel}
        />
        <InputItem
          label="备注"
          value={modalData.remark}
          onChange={(e) => setModalData("remark", e.target.value)}
          disabled={isDel}
        />
      </Modal>
    </>
  );
};

export default BaseModal;
