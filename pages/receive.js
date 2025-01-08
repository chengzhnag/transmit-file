import { useState, useMemo } from 'react';
import {
  Button, Input, Space,
  Grid, Spin, Layout,
  message, Typography
} from 'antd';
import axios from 'axios';

import styles from '../styles/send.module.css';

const { Paragraph, Title } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

export default function Entry() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const [receivedFile, setReceivedFile] = useState(null);
  const [receivedFileName, setReceivedFileName] = useState('');
  const [isDown, setIsDown] = useState(false);
  const [progress, setProgress] = useState(0);
  const screens = useBreakpoint();

  const handleReceiveFile = async () => {
    console.log('handleReceiveFile:', code);
    if (!code) {
      message.error('请输入会话代码');
      return;
    }
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
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      console.log('handleReceiveFile error:', err || err?.message);
      message.error(err?.response?.message || '获取文件失败，请确认会话代码是否正确');
    }
  };

  const downloadFile = async (code, fileName) => {
    try {
      setDownLoading(true);
      // 调用下载接口
      const response = await axios({
        url: `/api/download?code=${code}`,
        method: 'GET',
        responseType: 'blob', // 返回数据类型为 Blob
        onDownloadProgress: (progressEvent) => {
          console.log('progressEvent:', progressEvent);
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      // 将响应转换为 Blob
      const blob = new Blob([response.data]);
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
      setIsDown(true);
      setDownLoading(false);
      // handleRemoveFile();
    } catch (err) {
      setDownLoading(false);
      console.error('文件下载失败:', err);
      message.error('文件下载失败，请重试');
    }
  };

  const handleRemoveFile = async () => {
    try {
      const req = await axios.get(`/api/remove-file?code=${code}`);
      console.log('handleRemoveFile req:', req);
    } catch (err) {
      console.log('handleRemoveFile error:', err || err?.message);
    }
  }


  const isMobile = useMemo(() => {
    return screens?.xs;
  }, [screens]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Content style={{ padding: 18 }}>
        <div className={styles.block}>
          <Title level={5}>输入会话代码：</Title>
          <Input.OTP
            length={5}
            value={code}
            onChange={(text) => {
              setCode(text);
            }}
          />
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleReceiveFile}>
              接收文件
            </Button>
          </div>
        </div>
        {
          receivedFile && (
            <div className={styles.block}>
              <Title level={5}>对方已发送文件，点击下载：</Title>
              <Paragraph>文件名：{receivedFileName}</Paragraph>
              <Space>
                <Button
                  disabled={isDown}
                  type="primary"
                  onClick={() => {
                    downloadFile(code, receivedFileName);
                  }}
                >
                  {isDown ? '已下载' : '下载文件'}
                </Button>
                {
                  isMobile ? null : (
                    <Button onClick={() => {
                      window.location.href = '/';
                    }}>
                      回到首页
                    </Button>
                  )
                }
              </Space>
            </div>
          )
        }
      </Content>
      <Spin tip="等待对方发送文件..." spinning={loading} fullscreen />
      <Spin tip={`正在下载文件，目前进度：${progress}%...`} spinning={downLoading} fullscreen />
    </Layout>
  );
}