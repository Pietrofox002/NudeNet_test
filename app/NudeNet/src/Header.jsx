import React, { useState } from 'react';
import { Row, Col } from 'antd';
import FolderSelector from './FolderSelector';
import ScanOptions from './ScanOptions';

const Header = ({ selectedFolder, setSelectedFolder, isScanning, setIsScanning, setProgress }) => {
  const [scanSubfolders, setScanSubfolders] = useState(true);
  const [minSize, setMinSize] = useState(20);
  const [maxSize, setMaxSize] = useState(40 * 1024);
  const [extensions, setExtensions] = useState(['png', 'jpg', 'jpeg']);

  return (
    <header style={{ background: '#1f1f1f', padding: '20px', height: 'auto' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FolderSelector 
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            isScanning={isScanning}
            setIsScanning={setIsScanning}
            setProgress={setProgress}
            scanOptions={{ scanSubfolders, minSize, maxSize, extensions }}
          />
        </Col>
        <Col xs={24} sm={24} md={18} lg={18} xl={18}>
          <ScanOptions 
            scanSubfolders={scanSubfolders}
            setScanSubfolders={setScanSubfolders}
            minSize={minSize}
            setMinSize={setMinSize}
            maxSize={maxSize}
            setMaxSize={setMaxSize}
            extensions={extensions}
            setExtensions={setExtensions}
          />
        </Col>
      </Row>
    </header>
  );
};

export default Header;