import { useState } from 'react';
import {
  Upload, Button, Input,
  Progress, message,
  Space
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
const tus = require('tus-js-client');

export default function Entry() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [receivedFile, setReceivedFile] = useState(null);
  const [receivedFileName, setReceivedFileName] = useState('');

  const handleFileChange = (info) => {
    console.log('handleFileChange:', info);
    setFile(info.fileList?.[0]?.originFileObj);
  };

  const createSession = async () => {
    try {
      const res = await axios.post('/api/create-session');
      setSessionCode(res.data.code);
      message.success('Session created successfully');
    } catch (err) {
      message.error('Failed to create session');
    }
  };

  const handleSendFile = async () => {
    console.log('handleSendFile:', file, code);
    if (!file || !code) return;

    setUploading(true);
    setUploadProgress(0);

    const upload = new tus.Upload(file, {
      endpoint: '/api/upload', // 服务器上传接口
      retryDelays: [0, 1000, 3000, 5000], // 重试延迟
      chunkSize: 3 * 1024 * 1024, // 分片大小（3MB）
      metadata: {
        code,
        filename: file.name,
        filetype: file.type,
      },
      onError: (error) => {
        console.error('上传失败:', error);
        alert('上传失败，请重试');
        setUploading(false);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        setUploadProgress(Number(percentage));
      },
      onSuccess: () => {
        console.log('upload:', upload, upload.url);
        setUploading(false);
        alert('文件上传成功！');
      },
    });

    upload.start(); // 开始上传
  };

  const handleReceiveFile = async () => {
    console.log('handleReceiveFile:', code);
    try {
      const req = await axios.post('/api/receive-file', { code });
      console.log('req:', req);
      const status = req?.data?.status;
      if (status === 1) {
        setReceivedFile(req?.data?.filePath);
        setReceivedFileName(req?.data?.fileName);
      } else {
        setTimeout(() => {
          handleReceiveFile();
        }, 1500);
      }
    } catch (err) {
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
      <Button type="primary" href='/send'>
        我要发送
      </Button>
      <Button type="primary" href='/receive'>
        我要接收
      </Button>
      {/* <Space direction="vertical" size="large">
        <Upload maxCount={1} beforeUpload={() => false} onChange={handleFileChange}>
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <Button onClick={createSession}>创建会话</Button>
        {sessionCode && <p>会话代码: {sessionCode}</p>}
        <Input placeholder="输入会话代码" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button type="primary" onClick={handleSendFile}>发送文件</Button>
        <Progress percent={uploadProgress} />
        <Button type="primary" onClick={handleReceiveFile}>接收文件</Button>
      </Space> */}
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
    </div>
  );
}