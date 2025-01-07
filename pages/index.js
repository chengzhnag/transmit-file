import {
  Layout, Flex,
  Typography, Col, Row,
  Space
} from 'antd';
import { FireTwoTone } from '@ant-design/icons';

import styles from '../styles/home.module.css';

const { Header, Footer, Content } = Layout;

export default function Home() {

  return (
    <Layout>
      <Header className={styles.header}>
        <Flex className={styles.headerContent} justify='space-between' align='center'>
          <a className={styles.logo} href="/">
            <img alt="logo" src="https://cdn.jsdelivr.net/gh/Zgrowth/image@master/20250103/method-draw-image-(6).1e8okgy0xx.svg" />
            <span>LANDING</span>
          </a>
          <div style={{ display: 'flex' }}>
            <a href="https://github.com/ant-design/ant-design-landing" alt="help" target="_blank" className={styles.gitbtn}>帮助</a>
            <a href="https://github.com/chengzhnag" alt="git" target="_blank" className={styles.gitbtn}>Github</a>
          </div>
        </Flex>
      </Header>
      <Content className={styles.content}>
        <div className={styles.contentInner}>
          <img src='/assets/bg.svg' />
          <div className={`${styles.contentInnerContent} contentInnerContent`}>
            <img alt="logo" src="https://cdn.jsdelivr.net/gh/Zgrowth/image@master/20250103/method-draw-image-(6).1e8okgy0xx.svg" />
            <p>
              Ant Design Landing 平台拥有丰富的各类首页模板，下载模板代码包，即可快速使用，也可使用首页编辑器，快速搭建一个属于你的专属首页
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
            {Array.from({ length: 3 }).map((_, i) => (
              <Col key={i} xs={24} sm={24} md={8} span={8} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
                <FireTwoTone style={{ fontSize: 76 }} />
                <p style={{ fontSize: 16, color: '#0d1a26', marginTop: 56, textAlign: 'center', padding: '0 48px', maxWidth: 320 }}>
                  测试文本测试文本测试文本测试文本测试文本测试文本
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
