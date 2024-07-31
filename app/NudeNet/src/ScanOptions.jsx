import React from 'react';
import { Checkbox, InputNumber, Select, Row, Col } from 'antd';

const { Option } = Select;

const ScanOptions = ({ 
  scanSubfolders, setScanSubfolders, 
  minSize, setMinSize, 
  maxSize, setMaxSize, 
  extensions, setExtensions 
}) => {
  return (
    <Row gutter={[16, 16]}>
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
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="File Extensions"
          onChange={setExtensions}
          value={extensions}
        >
          {extensions.map(ext => (
            <Option key={ext} value={ext}>{ext}</Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default ScanOptions;