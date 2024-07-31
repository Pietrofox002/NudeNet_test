import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { listen } from "@tauri-apps/api/event";
import Header from './Header';
import ScanResults from './ScanResults';
import './App.css';

const { Content } = Layout;

function App() {
  const [selectedFolder, setSelectedFolder] = useState('');
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

  return (
    <Layout style={{ minHeight: '100vh', background: '#141414' }}>
      <Header 
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
        setProgress={setProgress}
      />
      <Content style={{ padding: '20px' }}>
        <ScanResults 
          selectedFolder={selectedFolder}
          progress={progress}
          isScanning={isScanning}
        />
      </Content>
    </Layout>
  );
}

export default App;
