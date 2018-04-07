import React, { Component } from 'react';
import { Button, Row, Col, Switch, Icon, DatePicker, Steps, Tabs, Breadcrumb } from 'antd';

import ThemeProvider from './ThemeProvider';

const { Step } = Steps;
const { TabPane } = Tabs;

class App extends Component {
  state = { primary: '#00375B', secondary: '#4D4D4D' }

  render() {
    const vars = {
      '@primary-color': '#00375B',
      '@text-color': '#4D4D4D',
      '@text-color-secondary': '#4D4D4D'
    }
    return (
      <div className="App">
        <Row>
          <Col xs={24} >
            <ThemeProvider vars={vars} />
            
          </Col>
          <Col xs={24}>
            <Row><Switch defaultChecked onChange={() => { }} /></Row>
            <Row>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
                <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
                <Breadcrumb.Item>An Application</Breadcrumb.Item>
              </Breadcrumb>
            </Row>

            <Row style={{ padding: '20px' }}><div>
              <Button type="primary">Primary</Button>
              <Button>Default</Button>
              <Button type="dashed">Dashed</Button>
              <Button type="danger">Danger</Button>
              <DatePicker onChange={() => { }} />
            </div></Row>
            <Row style={{ padding: '20px' }}>
              <Steps current={1}>
                <Step title="Finished" description="This is a description." />
                <Step title="In Progress" description="This is a description." />
                <Step title="Waiting" description="This is a description." />
              </Steps>
            </Row>
            <Row>
              <Tabs defaultActiveKey="2">
                <TabPane tab={<span><Icon type="apple" />Tab 1</span>} key="1">
                  Tab 1
              </TabPane>
                <TabPane tab={<span><Icon type="android" />Tab 2</span>} key="2">
                  Tab 2
              </TabPane>
              </Tabs>
            </Row>
            <Row>
            </Row>

          </Col>
        </Row >
      </div >
    );
  }
}

export default App;
