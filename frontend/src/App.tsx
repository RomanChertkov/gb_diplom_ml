import {Layout, theme, Typography } from 'antd';
import PageContent from "./PageContent.tsx";

const {
    Header,
    Content,
} = Layout;


export default function App () {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{height:'100vh',width:'100vw'}}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
          <Typography.Title
              level={2}
              style={{color:"white"}}
          >
              GeekBrains. Дипломный Проект Черткова Р.И.
          </Typography.Title>
      </Header>
      <Content style={{marginTop:20, padding: '0 48px' }}>

        <div
          style={{
            minHeight: 'calc(100vh - 120px)',
            background: colorBgContainer,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <PageContent />
        </div>
      </Content>
    </Layout>
  );
};
