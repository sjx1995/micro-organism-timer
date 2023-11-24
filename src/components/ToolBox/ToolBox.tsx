/*
 * @Description: 底部工具栏
 * @Author: Sunly
 * @Date: 2023-11-17 15:37:53
 */
import React from "react";
import { FloatButton } from "antd";
import { Icon } from "@iconify/react";

import type { IChangeModalType } from "../../App";

const ImportIcon = <Icon icon="uil:import" />;
const ExportIcon = <Icon icon="uil:export" />;
const AddIcon = <Icon icon="ic:outline-add" />;

const ToolBox: React.FC<{
  onChangeModalType: IChangeModalType;
}> = ({ onChangeModalType }) => {
  return (
    <FloatButton.Group shape="square" style={{ right: 94 }}>
      <FloatButton
        description={AddIcon}
        tooltip="添加"
        onClick={() => onChangeModalType("ADD")}
      />
      <FloatButton description={ImportIcon} tooltip="导入" />
      <FloatButton description={ExportIcon} tooltip="导出" />
    </FloatButton.Group>
  );
};

export default ToolBox;
