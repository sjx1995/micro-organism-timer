/*
 * @Description: 底部工具栏
 * @Author: Sunly
 * @Date: 2023-11-17 15:37:53
 */
import { Icon } from "@iconify/react";
import { Alert, Button, ButtonGroup, Snackbar, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useVesselModalStore } from "../../store/modal.store";
import { useVesselStore } from "../../store/vessel.store";
import ImportModal from "../Modal/ImportModal";
import "./ToolBox.css";

const ToolBox: React.FC = () => {
  const { vessels } = useVesselStore();
  const { openAddVesselModal } = useVesselModalStore();

  const [open, setOpen] = useState(false);

  const [, setCopied] = useState(false);
  const handleCopied = () => {
    setCopied(true);
    setOpen(true);
  };

  const [importModalVisible, setModalVisible] = useState(false);
  const handleCloseImportModal = () => {
    setModalVisible(false);
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
          severity="success"
          sx={{ width: "100%" }}
        >
          数据已复制到剪切板
        </Alert>
      </Snackbar>

      <ImportModal
        visible={importModalVisible}
        onClose={handleCloseImportModal}
      />

      <ButtonGroup
        variant="contained"
        style={{ position: "fixed", right: "16px", bottom: "16px", zIndex: 99 }}
      >
        <Tooltip title="添加数据" arrow>
          <Button onClick={openAddVesselModal}>
            <Icon className="tool-box-icon" icon="ic:outline-add" />
          </Button>
        </Tooltip>

        <Tooltip title="导入数据" arrow>
          <Button onClick={() => setModalVisible(true)}>
            <Icon className="tool-box-icon" icon="mingcute:file-import-line" />
          </Button>
        </Tooltip>

        <CopyToClipboard text={JSON.stringify(vessels)} onCopy={handleCopied}>
          <Tooltip title="导出数据到剪贴板" arrow>
            <Button>
              <Icon className="tool-box-icon" icon="mingcute:copy-line" />
            </Button>
          </Tooltip>
        </CopyToClipboard>
      </ButtonGroup>

      {/* <Fab
        color="primary"
        variant="extended"
        size="small"
        onClick={openAddVesselModal}
      >
        添加数据
      </Fab>
      <Fab
        color="primary"
        variant="extended"
        size="small"
        onClick={() => setModalVisible(true)}
      >
        导入数据
      </Fab>

        <Fab color="primary" variant="extended" size="small">
          导出数据到剪贴板
        </Fab> */}
      {/* <FloatButton.Group shape="square">
        <FloatButton
          description={AddIcon}
          tooltip="添加"
          onClick={openAddVesselModal}
        />
        <FloatButton
          description={ImportIcon}
          tooltip="导入数据"
          onClick={() => setModalVisible(true)}
        />
        <CopyToClipboard text={JSON.stringify(vessels)} onCopy={handleCopied}>
          <FloatButton description={ExportIcon} tooltip="导出数据到剪贴板" />
        </CopyToClipboard>
      </FloatButton.Group> */}
    </>
  );
};

export default ToolBox;
