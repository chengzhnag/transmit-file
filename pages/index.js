import { useState } from 'react';
import { Upload, Button, Input, Progress, message, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
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

    const reader = new FileReader();
    reader.onloadend = async () => {
      const formData = { code, file: { name: file.name, data: reader.result.split(',')[1] } };

      try {
        await axios.post('/api/send-file', formData, {
          onUploadProgress: (progressEvent) => {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        });
        message.success('File sent successfully');
      } catch (err) {
        message.error('Failed to send file');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReceiveFile = async () => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/receive-file', true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        setDownloadProgress(Math.round((event.loaded * 100) / event.total));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const fileData = xhr.response.file;
        const fileName = xhr.response.fileName;
        const fileBlob = new Blob([Buffer.from(fileData, 'base64')], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(fileBlob);
        setReceivedFile(url);
        setReceivedFileName(fileName);
        message.success('File received successfully');
      } else {
        message.error('Failed to receive file');
      }
    };

    xhr.onerror = () => {
      message.error('Failed to receive file');
    };

    xhr.send(JSON.stringify({ code }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>文件传输</h1>
      <Space direction="vertical" size="large">
        <Upload maxCount={1} beforeUpload={() => false} onChange={handleFileChange}>
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <Button onClick={createSession}>创建会话</Button>
        {sessionCode && <p>会话代码: {sessionCode}</p>}
        <Input placeholder="输入会话代码" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button type="primary" onClick={handleSendFile}>发送文件</Button>
        <Progress percent={uploadProgress} />
        <Button type="primary" onClick={handleReceiveFile}>接收文件</Button>
        <Progress percent={downloadProgress} />
      </Space>
      {receivedFile && (
        <div>
          <h2>接收到的文件</h2>
          <a href={receivedFile} download={receivedFileName}>
            下载文件
          </a>
        </div>
      )}
    </div>
  );
}
