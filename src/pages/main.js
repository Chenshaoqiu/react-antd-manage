import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, theme } from 'antd';
import CommonTag from '../components/commonTag';
import CommonHeader from '../components/commonHeader';
import CommonAside from '../components/commonAside';
import { useSelector } from 'react-redux';
import { RouterAuth } from '../router/routerAuth';

const { Content } = Layout;

const Main = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const collapsed = useSelector((state) => state.tab.isCollapse);

  return (
    <RouterAuth>
      <Layout className="main-container">
        {/* <CommonAside collapsed={collapsed} />
        <Layout>
          <CommonHeader collapsed={collapsed} />
          <CommonTag />
          <Content
            style={{
              margin: '16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout> */}
        <CommonHeader collapsed={collapsed} />
        <Layout>
          <CommonAside collapsed={collapsed} />
          <Layout>
            <CommonTag />
            <Content
              style={{
                margin: '0 16px 16px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </RouterAuth>
  );
};

export default Main;
