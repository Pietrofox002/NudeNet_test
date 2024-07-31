import React, { useState, useEffect } from 'react';
import { Button, Layout, Typography, Checkbox, InputNumber, Select, Space, Card, Row, Col, Statistic } from 'antd';
import { FolderOpenOutlined, FileSearchOutlined, WarningOutlined } from '@ant-design/icons';
import { invoke } from "@tauri-apps/api/tauri";
import { open } from '@tauri-apps/api/dialog';
import { listen } from "@tauri-apps/api/event";
import './App.css';

const { Header, Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const defaultExtensions = ['png', 'jpg', 'jpeg'];

function App() {
  const [selectedFolder, setSelectedFolder] = useState('');
  const [scanSubfolders, setScanSubfolders] = useState(true);
  const [minSize, setMinSize] = useState(20);
  const [maxSize, setMaxSize] = useState(40 * 1024);
  const [extensions, setExtensions] = useState(defaultExtensions);
  const [progress, setProgress] = useState({ scanned_count: 0, nsfw_count: 0 });
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const setupListener = async () => {
      try {
        const unsubscribe = await listen('scan_progress', (event) => {
          setProgress(event.payload);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error setting up event listener:", error);
      }
    };

    const unsubscribe = setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe.then(f => f()).catch(err => console.error("Error unsubscribing:", err));
      }
    };
  }, []);

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
          scanSubfolders,
          minSize,
          maxSize,
          extensions
        });

        setIsScanning(false);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      setIsScanning(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#141414' }}>
      <Header style={{ background: '#1f1f1f', padding: '20px', height: 'auto' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Button
              type="primary"
              icon={<FolderOpenOutlined />}
              onClick={handleSelectFolder}
              disabled={isScanning}
              style={{ width: '100%', height: '40px' }}
            >
              {isScanning ? 'Scanning...' : 'Select Folder'}
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Checkbox 
              checked={scanSubfolders} 
              onChange={(e) => setScanSubfolders(e.target.checked)}
              style={{ color: '#fff' }}
            >
              Scan Subfolders
            </Checkbox>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <InputNumber
              addonBefore={<span style={{ color: '#fff' }}>Min KB</span>}
              min={0}
              value={minSize}
              onChange={setMinSize}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <InputNumber
              addonBefore={<span style={{ color: '#fff' }}>Max KB</span>}
              min={0}
              value={maxSize}
              onChange={setMaxSize}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="File Extensions"
              onChange={setExtensions}
              defaultValue={defaultExtensions}
            >
              {defaultExtensions.map(ext => (
                <Option key={ext} value={ext}>{ext}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {selectedFolder && (
            <Text style={{ color: '#fff' }}>Selected folder: {selectedFolder}</Text>
          )}
          <Card style={{ background: '#1f1f1f', borderRadius: '8px' }}>
            <Row gutter={16} justify="center">
              <Col xs={24} sm={12}>
                <Statistic
                  title={<span style={{ color: '#fff' }}>Files Scanned</span>}
                  value={progress.scanned_count}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<FileSearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Statistic
                  title={<span style={{ color: '#fff' }}>NSFW Detected</span>}
                  value={progress.nsfw_count}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<WarningOutlined />}
                />
              </Col>
            </Row>
          </Card>
          {isScanning && (
            <Text style={{ color: '#fff', textAlign: 'center', display: 'block' }}>
              Scanning in progress...
            </Text>
          )}
        </Space>
      </Content>
    </Layout>
  );
}

export default App;