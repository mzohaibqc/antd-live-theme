import React, { Component } from 'react';
import {
  Row,
  Col,
  Icon,
  Breadcrumb,
  Layout,
  Form,
  Select,
  Switch,
  Radio,
  message,
  Button,
  Upload,
  DatePicker,
  Progress,
  Timeline,
  Checkbox
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
      '@layout-sider-background': '#cccccc',
      '@btn-primary-bg': '#397dcc',
      '@processing-color': '#397dcc'
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

  onCollapse = collapsed => {
    this.setState({ collapsed });
    console.log('onCollapse', collapsed);
  }

  getColorPicker = (varName, position) => (
    <Row className="color-row" key={varName}>
      <Col xs={4} className="color-palette">
        <ColorPicker
          type="sketch"
          small
          color={this.state.vars[varName]}
          position={position || 'right'}
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
      <Col className="color-name" xs={20}>{varName}</Col>
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
    const { collapsed } = this.state;
    const colorPickers = Object.keys(this.state.vars).map((varName, index) => (
      this.getColorPicker(varName, index > 3 ? 'top': 'right')
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
              collapsedWidth={40}
              collapsed={collapsed}
              width={300}
              onBreakpoint={broken => {
                console.log(broken);
                this.onCollapse(broken);
              }}
              onCollapse={this.onCollapse}
            >
                <Row className="theme-heading">
                 {<Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={() => this.onCollapse(!collapsed)} />}
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
                <Col xs={24} lg={{ span: 15, offset: 3 }}>
                  <Form onSubmit={this.handleSubmit}>
                    <Col xs={24} md={12}>
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
                        <Button type="default" style={{ marginRight: 15 }}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </FormItem>
                      
                      <Row
                        type="flex"
                        justify="center"
                      >
                        <Checkbox checked>One</Checkbox>
                        <Checkbox >Two</Checkbox>
                        <Checkbox >Three</Checkbox>

                      </Row>
                      <Row
                        type="flex"
                        justify="space-around"
                        className="secondary-color"
                      >
                        color : @secondary-color;
                      <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} defaultChecked />

                      </Row>

                    </Col>
                   
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col xs={24} lg={{ span: 9, offset: 3 }} style={{ marginTop: 15 }}>
                  <Timeline>
                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                    <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                  </Timeline>
                </Col>
                <Col xs={24} lg={{ span: 12 }} style={{ marginTop: 15 }}>
                  <Timeline>
                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                    <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                  </Timeline>
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
