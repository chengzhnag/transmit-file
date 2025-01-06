import { useEffect, useState } from 'react';
import {
  Upload, Button,
  Progress, message,
  Space,Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
const tus = require('tus-js-client');

export default function Entry() {
  const [file, setFile] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (info) => {
    console.log('handleFileChange:', info);
    setFile(info.fileList?.[0]?.originFileObj);
  };

  const createSession = async () => {
    try {
      const res = await axios.post('/api/create-session');
      setSessionCode(res.data.code);
    } catch (err) {
      message.error('Failed to create session');
    }
  };

  const handleSendFile = async () => {
    console.log('handleSendFile:', file, sessionCode);
    if (!file || !sessionCode) return;

    setUploading(true);
    setUploadProgress(0);

    const upload = new tus.Upload(file, {
      endpoint: '/api/upload', // 服务器上传接口
      retryDelays: [0, 1000, 3000, 5000], // 重试延迟
      chunkSize: 3 * 1024 * 1024, // 分片大小（3MB）
      metadata: {
        code: sessionCode,
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

  useEffect(() => {
    createSession();
  }, []);

  return (
    <div>
      <Space direction="vertical" size="large">
        {sessionCode && <p>会话代码: {sessionCode}</p>}
        <Upload maxCount={1} beforeUpload={() => false} onChange={handleFileChange}>
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <Button loading={uploading} type="primary" onClick={handleSendFile}>确认发送</Button>
      </Space>
      <Spin spinning={uploading} percent={uploadProgress} fullscreen />
    </div>
  );
}