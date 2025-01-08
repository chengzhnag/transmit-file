import { useEffect, useState, useMemo } from 'react';
import {
  Upload, Button, message,
  Layout, Spin, Typography,
  Grid, Space, Result
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
const tus = require('tus-js-client');

import styles from '../styles/send.module.css';

const { Paragraph, Title } = Typography;
const { Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export default function Entry() {
  const [file, setFile] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const screens = useBreakpoint();

  const handleFileChange = (info) => {
    console.log('handleFileChange:', info);
    setFile(info.fileList?.[0]?.originFileObj);
  };

  const createSession = async () => {
    try {
      const res = await axios.post('/api/create-session');
      setSessionCode(res.data.code);
    } catch (err) {
      message.error('生成会话代码失败');
    }
  };

  const handleSendFile = async () => {
    console.log('handleSendFile:', file, sessionCode);
    if (!sessionCode) {
      message.error('会话代码生成失败，请刷新页面重试');
      return;
    };
    if (!file) {
      message.error('请先选择文件');
      return;
    };

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
        setUploading(false);
        message.error('上传失败，请重试');
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        setUploadProgress(Number(percentage));
      },
      onSuccess: () => {
        console.log('upload:', upload);
        setUploading(false);
        setIsSuccess(true);
      },
    });

    upload.start(); // 开始上传
  };

  useEffect(() => {
    createSession();
  }, []);

  const isMobile = useMemo(() => {
    return screens?.xs;
  }, [screens]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      {
        isSuccess ? (
          <div style={{ paddingTop: 100 }}>
            <Result
              status="success"
              title={
                <div style={{ fontSize: 18 }}>
                  文件发送成功，对方正在接收中！
                </div>
              }
              extra={[
                <Button type='primary' onClick={() => {
                  window.location.href = '/'
                }}>
                  回到首页
                </Button>,
              ]}
            />
          </div>
        ) : (
          <Content style={{ padding: 18 }}>
            <div className={styles.block}>
              <Title level={5}>会话代码：</Title>
              <Paragraph style={{ marginBottom: 0 }}>已为你生成一个会话代码，请将此代码发送给对方，对方将使用该代码接收文件</Paragraph>
              <Paragraph style={{ marginBottom: 0 }} copyable={{ text: sessionCode }}>
                <span style={{ fontSize: 40 }}>{sessionCode}</span>
              </Paragraph>
            </div>
            <div className={styles.block}>
              <Title level={5}>选择文件：</Title>
              <Upload.Dragger maxCount={1} beforeUpload={() => false} onChange={handleFileChange}>
                <p>
                  <InboxOutlined />
                </p>
                <p style={{ fontSize: 16, color: '#222', marginBottom: 4 }}>点击此区域进行文件上传</p>
                <p style={{ fontSize: 14, color: '#666' }}>
                  支持 docx, xls, PDF, rar, zip, PNG, JPG 等类型的文件。仅支持单文件上传
                </p>
              </Upload.Dragger>
            </div>
            {
              isMobile ? (
                <div style={{ textAlign: "center" }}>
                  <Button
                    size='large'
                    loading={uploading}
                    type="primary"
                    onClick={handleSendFile}
                    style={{ width: '100%' }}
                  >
                    确认发送
                  </Button>
                </div>
              ) : null
            }
          </Content>
        )
      }
      {
        !isMobile && !isSuccess ? (
          <Footer style={{ background: '#fff', borderTop: '1px solid #E6E7EB', padding: "18px" }}>
            <Space style={{ width: '100%', display: "flex" }}>
              <Button
                size='large'
                loading={uploading}
                type="primary"
                onClick={handleSendFile}
                style={{ width: 110 }}
              >
                确认发送
              </Button>
              <Button size='large' style={{ width: 110 }} onClick={() => history.back()}>取消</Button>
            </Space>
          </Footer>
        ) : null
      }
      <Spin
        tip={`文件发送中，请耐心等待，目前进度${uploadProgress}%...`}
        spinning={uploading}
        // percent={uploadProgress}
        fullscreen
      />
    </Layout>
  );
}