import React from 'react';
import { Space, Card, Row, Col, Statistic, Typography } from 'antd';
import { FileSearchOutlined, WarningOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ScanResults = ({ selectedFolder, progress, isScanning }) => {
  return (
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
  );
};

export default ScanResults;