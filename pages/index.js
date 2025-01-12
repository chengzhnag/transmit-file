import { useMemo } from 'react';
import {
  Layout, Flex,
  Typography, Col, Row,
  Space, Grid
} from 'antd';
import { FireTwoTone, ThunderboltTwoTone, RocketTwoTone } from '@ant-design/icons';

import styles from '../styles/home.module.css';

const { Header, Footer, Content } = Layout;
const { useBreakpoint } = Grid;

const characteristics = [
  {
    title: '简单',
    icon: <FireTwoTone style={{ fontSize: 76 }} />,
    description: '由于 Vercel 的资源限制以及免费服务计划的带宽和性能约束，文件传输速度较慢',
  },
  {
    title: '简单',
    icon: <ThunderboltTwoTone style={{ fontSize: 76 }} />,
    description: '我们始终坚持“用爱发电”的理念，致力于为用户提供一个无门槛、无广告的纯净文件传输环境。',
  },
  {
    title: '简单',
    icon: <RocketTwoTone style={{ fontSize: 76 }} />,
    description: '不定期更新，认真倾听用户的反馈，优化现有功能，并尝试加入更多实用的新特性。',
  },
];

export default function Home() {
  const screens = useBreakpoint();

  const isMobile = useMemo(() => {
      return screens?.xs;
    }, [screens]);

  return (
    <Layout>
      <Header className={styles.header}>
        <Flex className={`${styles.headerContent} ${isMobile ? styles.headerContent2 : ''}`} justify='space-between' align='center'>
          <a className={styles.logo} href="/">
            <img alt="logo" src="https://cdn.jsdelivr.net/gh/Zgrowth/image@master/20250103/method-draw-image-(6).1e8okgy0xx.svg" />
            <span>CZ TRANS FILE</span>
          </a>
          <div style={{ display: 'flex' }}>
            <a href="https://chengzhnag.github.io/collect/2025-1-10-1736479160098.html" style={{marginLeft: 0}} alt="help" target="_blank" className={styles.gitbtn}>help</a>
            <a href="https://github.com/chengzhnag/transmit-file" alt="git" target="_blank" className={styles.gitbtn}>Github</a>
          </div>
        </Flex>
      </Header>
      <Content className={styles.content}>
        <div className={styles.contentInner}>
          <img src='/assets/bg.svg' />
          <div className={`${styles.contentInnerContent} contentInnerContent`}>
            <img alt="logo" src="https://cdn.jsdelivr.net/gh/Zgrowth/image@master/20250103/method-draw-image-(6).1e8okgy0xx.svg" />
            <p>
              Chengzhnag Trans File 是一款便捷的文件传输平台，专为用户提供跨设备、跨平台的快速文件传输服务。
              平台以实现最简单的文件传输功能为核心，致力于为用户提供极简的操作体验。
            </p>
            <div className={styles.buttonWrapper}>
              <Space>
                <a href="/send" alt="git">
                  我要发送
                </a>
                <a href="/receive" alt="git">
                  我要接收
                </a>
              </Space>
            </div>
          </div>
        </div>
        <div className={styles.contentInner2}>
          <Typography.Title level={1} style={{
            margin: '0 auto 64px',
            fontSize: 32,
            color: '#314659',
            textAlign: 'center'
          }}>
            三大特征
          </Typography.Title>
          <Row >
            {characteristics.map((_, i) => (
              <Col key={i} xs={24} sm={24} md={8} span={8} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
                {_.icon}
                <p style={{ fontSize: 16, color: '#0d1a26', marginTop: 56, textAlign: 'center', padding: '0 48px', maxWidth: 320 }}>
                  {_.description}
                </p>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer className={styles.footer}>
        <div className={styles.footerContent}>
          Made with
          <span>❤</span>
          by
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/chengzhnag">
            chengzhnag
          </a>
        </div>
      </Footer>
    </Layout>
  );
}
