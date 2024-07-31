import React from 'react';
import { Button } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from "@tauri-apps/api/tauri";

const FolderSelector = ({ selectedFolder, setSelectedFolder, isScanning, setIsScanning, setProgress, scanOptions }) => {
  const handleSelectFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected) {
        setSelectedFolder(selected);
        setIsScanning(true);
        setProgress({ scanned_count: 0, nsfw_count: 0 });

        await invoke('select_folder', { 
          path: selected,
          scanSubfolders: scanOptions.scanSubfolders,
          minSize: scanOptions.minSize,
          maxSize: scanOptions.maxSize,
          extensions: scanOptions.extensions
        });

        setIsScanning(false);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      setIsScanning(false);
    }
  };

  return (
    <Button
      type="primary"
      icon={<FolderOpenOutlined />}
      onClick={handleSelectFolder}
      disabled={isScanning}
      style={{ width: '100%', height: '40px' }}
    >
      {isScanning ? 'Scanning...' : 'Select Folder'}
    </Button>
  );
};

export default FolderSelector;
