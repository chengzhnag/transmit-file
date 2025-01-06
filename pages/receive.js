import { useState } from 'react';
import {
  Button, Input,
  Space, Spin
} from 'antd';
import axios from 'axios';

export default function Entry() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [receivedFile, setReceivedFile] = useState(null);
  const [receivedFileName, setReceivedFileName] = useState('');

  const handleReceiveFile = async () => {
    console.log('handleReceiveFile:', code);
    setLoading(true);
    try {
      const req = await axios.post('/api/receive-file', { code });
      console.log('req:', req);
      const status = req?.data?.status;
      if (status === 1) {
        setLoading(false);
        setReceivedFile(req?.data?.filePath);
        setReceivedFileName(req?.data?.fileName);
      } else {
        setTimeout(() => {
          handleReceiveFile();
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      console.log('handleReceiveFile error:', err || err?.message);
    }
  };

  const downloadFile = async (code, fileName) => {
    try {
      // 调用下载接口
      const response = await fetch(`/api/download?code=${code}`);
      if (!response.ok) {
        throw new Error('文件下载失败');
      }

      // 将响应转换为 Blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // 创建下载链接并触发下载
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('文件下载失败:', err);
      alert('文件下载失败，请重试');
    }
  };

  return (
    <div>
      <Space direction="vertical" size="large">
        <Input placeholder="输入会话代码" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button type="primary" onClick={handleReceiveFile}>接收文件</Button>
      </Space>
      {
        receivedFile && (
          <div>
            <h2>接收到的文件</h2>
            <Button type="primary" onClick={() => {
              downloadFile(code, receivedFileName);
            }}>
              下载文件
            </Button>
          </div>
        )
      }
      <Spin spinning={loading} fullscreen />
    </div>
  );
}