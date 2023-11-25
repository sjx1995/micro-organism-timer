/*
 * @Description: 底部工具栏
 * @Author: Sunly
 * @Date: 2023-11-17 15:37:53
 */
import React, { useState } from "react";
import { FloatButton, message } from "antd";
import { Icon } from "@iconify/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import type { IChangeModalType, IVessel } from "../../App";

const ImportIcon = <Icon icon="uil:import" />;
const ExportIcon = <Icon icon="uil:export" />;
const AddIcon = <Icon icon="ic:outline-add" />;

const ToolBox: React.FC<{
  onChangeModalType: IChangeModalType;
  vessels: IVessel[];
}> = ({ onChangeModalType, vessels }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [, setCopied] = useState(false);

  const handleCopied = () => {
    setCopied(true);
    messageApi.success("数据已复制到剪切板");
  };

  return (
    <>
      {contextHolder}
      <FloatButton.Group shape="square" style={{ right: 94 }}>
        <FloatButton
          description={AddIcon}
          tooltip="添加"
          onClick={() => onChangeModalType("ADD")}
        />
        <FloatButton description={ImportIcon} tooltip="导入" />
        <CopyToClipboard text={JSON.stringify(vessels)} onCopy={handleCopied}>
          <FloatButton description={ExportIcon} tooltip="导出" />
        </CopyToClipboard>
      </FloatButton.Group>
    </>
  );
};

export default ToolBox;
