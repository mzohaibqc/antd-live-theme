import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Icon,
  Menu,
  Breadcrumb,
  Layout,
  Form,
  Select,
  Switch,
  Radio,
  Card,
  message,
  Button,
  Upload,
  DatePicker,
  Progress
} from 'antd';
import moment from 'moment';

import Navbar from '../Navbar';
import ColorPicker from '../ColorPicker';

import './index.less';

const { Content, Footer, Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class App extends Component {
  constructor(props) {
    super(props);
    let initialValue = {
      '@primary-color': '#1987a7',
      '@secondary-color': '#0000ff',
      '@text-color': '#000000',
      '@text-color-secondary': '#eb2f96',
      '@heading-color': '#fa8c16',
      '@layout-header-background': '#000000',
      '@btn-primary-bg': '#397dcc'
    };
    let vars = {};

    try {
      vars = Object.assign(
        {},
        initialValue,
        JSON.parse(localStorage.getItem('app-theme'))
      );
    } finally {
      this.state = { vars, initialValue };
      window.less
        .modifyVars(vars)
        .then(() => {})
        .catch(error => {
          message.error('Failed to update theme');
        });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  onChangeComplete = (varName, color) => {
    const { vars } = this.state;
    vars[varName] = color;
    this.setState({ vars });
  };
  handleColorChange = (varname, color) => {
    const { vars } = this.state;
    if (varname) vars[varname] = color;
    console.log(vars);
    window.less
      .modifyVars(vars)
      .then(() => {
        // message.success(`Theme updated successfully`);
        this.setState({ vars });
        localStorage.setItem('app-theme', JSON.stringify(vars));
      })
      .catch(error => {
        message.error('Failed to update theme');
      });
  };

  getColorPicker = varName => (
    <Row className="color-row" key={varName}>
      <Col xs={4}>
        <ColorPicker
          type="sketch"
          small
          color={this.state.vars[varName]}
          position="right"
          presetColors={[
            '#F5222D',
            '#FA541C',
            '#FA8C16',
            '#FAAD14',
            '#FADB14',
            '#A0D911',
            '#52C41A',
            '#13C2C2',
            '#1890FF',
            '#2F54EB',
            '#722ED1',
            '#EB2F96'
          ]}
          onChangeComplete={color => this.handleColorChange(varName, color)}
        />
      </Col>
      <Col xs={20}>{varName}</Col>
    </Row>
  );

  resetTheme = () => {
    localStorage.setItem('app-theme', '{}');
    console.log(this.state.vars, this.state.initialValue);
    this.setState({ vars: { ...this.state.initialValue } });
    window.less.modifyVars(this.state.initialValue).catch(error => {
      message.error('Failed to reset theme');
    });
  };

  render() {
    const colorPickers = Object.keys(this.state.vars).map(varName => (
      this.getColorPicker(varName)
    ));
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    return (
      <Layout className="app">
        <Navbar />
        <Content className="content">
          <Layout>
            <Sider
              theme="dark"
              breakpoint="lg"
              collapsedWidth="0"
              width={250}
              onBreakpoint={broken => {
                console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
              }}
            >
                <Row className="theme-heading">
                  <h3 className="title">Choose Theme Colors</h3>
                </Row>
                {colorPickers}
            </Sider>
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Row>
                <Col xs={24} sm={{ span: 15, offset: 3 }}>
                  <Form onSubmit={this.handleSubmit}>
                    <Col xs={24} sm={12}>
                      <FormItem {...formItemLayout} label="Select[multiple]">
                        {getFieldDecorator('select-multiple', {
                          initialValue: ['red'],
                          rules: [
                            {
                              required: true,
                              message: 'Please select your favourite colors!',
                              type: 'array'
                            }
                          ]
                        })(
                          <Select
                            mode="multiple"
                            placeholder="Please select favourite colors"
                          >
                            <Option value="red">Red</Option>
                            <Option value="green">Green</Option>
                            <Option value="blue">Blue</Option>
                          </Select>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="Switch">
                        {getFieldDecorator('switch', {
                          valuePropName: 'checked',
                          initialValue: true
                        })(<Switch />)}
                      </FormItem>

                      <FormItem {...formItemLayout} label="Radio.Group">
                        {getFieldDecorator('radio-group', {
                          initialValue: 1
                        })(
                          <RadioGroup>
                            <Radio value={1}>A</Radio>
                            <Radio value={2}>B</Radio>
                            <Radio value={3}>C</Radio>
                            <Radio value={4}>D</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="Radio.Button">
                        {getFieldDecorator('radio-button', {
                          initialValue: 'a'
                        })(
                          <RadioGroup>
                            <RadioButton value="a">item 1</RadioButton>
                            <RadioButton value="b">item 2</RadioButton>
                            <RadioButton value="c">item 3</RadioButton>
                          </RadioGroup>
                        )}
                      </FormItem>
                      <Progress percent={60} />
                    </Col>
                    <Col xs={24} sm={12}>
                      <FormItem {...formItemLayout} label="Date">
                        {getFieldDecorator('date', {
                          initialValue: moment()
                        })(<DatePicker />)}
                      </FormItem>
                      <FormItem {...formItemLayout} label="Upload">
                        {getFieldDecorator('upload', {
                          valuePropName: 'fileList',
                          getValueFromEvent: this.normFile
                        })(
                          <Upload
                            name="logo"
                            action="/upload.do"
                            listType="picture"
                          >
                            <Button>
                              <Icon type="upload" /> Click to upload
                            </Button>
                          </Upload>
                        )}
                      </FormItem>
                      <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                        <Button type="default">Cancel</Button>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </FormItem>
                      <Row
                        type="flex"
                        justify="center"
                        className="secondary-color"
                      >
                        color : @secondary-color;
                      </Row>
                    </Col>
                  </Form>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design Live Theme ©2018 Created by Zohaib Ijaz (mzohaibqc)
        </Footer>
      </Layout>
    );
  }
}

export default Form.create()(App);
