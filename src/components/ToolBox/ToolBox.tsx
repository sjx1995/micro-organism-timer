/*
 * @Description: 底部工具栏
 * @Author: Sunly
 * @Date: 2023-11-17 15:37:53
 */
import React, { useState } from "react";
import { FloatButton, message } from "antd";
import { Icon } from "@iconify/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ImportModal from "../Modal/ImportModal";

import type { IChangeModalType, IImportVessels, IVessel } from "../../App";

import "./ToolBox.css";

const AddIcon = <Icon className="tool-box-icon" icon="ic:outline-add" />;
const ImportIcon = (
  <Icon className="tool-box-icon" icon="mingcute:file-import-line" />
);
const ExportIcon = <Icon className="tool-box-icon" icon="mingcute:copy-line" />;

const ToolBox: React.FC<{
  onChangeModalType: IChangeModalType;
  vessels: IVessel[];
  onImportVessels: IImportVessels;
}> = ({ onChangeModalType, vessels, onImportVessels }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [, setCopied] = useState(false);
  const handleCopied = () => {
    setCopied(true);
    messageApi.success("数据已复制到剪切板");
  };

  const [importModalVisible, setModalVisible] = useState(false);
  const handleCloseImportModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ImportModal
        visible={importModalVisible}
        onClose={handleCloseImportModal}
        onImport={onImportVessels}
      />
      {contextHolder}
      <FloatButton.Group shape="square" style={{ right: 94 }}>
        <FloatButton
          description={AddIcon}
          tooltip="添加"
          onClick={() => onChangeModalType("ADD")}
        />
        <FloatButton
          description={ImportIcon}
          tooltip="导入数据"
          onClick={() => setModalVisible(true)}
        />
        <CopyToClipboard text={JSON.stringify(vessels)} onCopy={handleCopied}>
          <FloatButton description={ExportIcon} tooltip="导出数据到剪贴板" />
        </CopyToClipboard>
      </FloatButton.Group>
    </>
  );
};

export default ToolBox;
