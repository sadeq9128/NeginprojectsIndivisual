import React,{Component} from 'react';
import 'antd/dist/antd.css';
import './Layout.css';
import { Layout, Menu } from 'antd';
import {Route,Redirect } from "react-router-dom";
import { BrowserRouter as Router, Link } from "react-router-dom";
import NewTools from "../../components/HoghoghiBuilder/NewTools/NewTools";
import TaminBuilder from "../../components/TaminBuilder/TaminBuilder";
import listtamin from "../../components/TaminBuilder/ListTamin/ListTamin";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

class SiderLayout extends Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    let token=localStorage.getItem("token");
    if(token===null){
      return (
        <Route
            path="/"
            render={() => {
                return (
                    <Redirect to="/" /> 
                )
            }}
        />
      );
    }
  
    return (
      <Router>
      <Layout style={{height: "inherit"}}>
        <Sider className="slider" trigger={null} collapsible collapsed={this.state.collapsed}>
          <h3 className="logo">داشبورد</h3>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={this.props.keyitem} >
            <Menu.Item key="1" icon={<UserOutlined />}>
              افراد حقوقی
              <Link to="/dashboard/hoghoghi" />
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              فرم بیمه تامین اجتماعی
              <Link to="/dashboard/tamin" />
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              لیست تامین اجتماعی
              <Link to="/dashboard/listtamin" />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout content">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <Route path="/dashboard/hoghoghi" component={NewTools}/>
            <Route path="/dashboard/tamin" component={TaminBuilder}/>
            <Route path="/dashboard/listtamin" component={listtamin}/>
          </Content>
        </Layout>
      </Layout>
      </Router>
    );
  }
}

export default SiderLayout;