import React from 'react';
import { Row, Col, Input } from 'antd';

const { Search } = Input;

class ColorInput extends React.Component {
  state = { vars: { '@primary-color': '#dddddd' } }
  onChange = (color) => {
    console.log(color);
    if (color.match(/^#[a-f0-9]{3,6}$/i)) {
      const vars = this.state.vars;
      vars['@primary-color'] = color;
      window.less.modifyVars(this.state.vars).then(() => {
        console.log('Theme updated successfully');
        this.setState({ vars });
      });
    }
  }
  updateVars = () => {
    window.less.modifyVars(this.state.vars).then(() => {
      console.log('Theme updated successfully');
    });
  }
  render() {
    return (
      <Row>
        <Col xs={24} style={{ marginBottom: '10px' }}><Search placeholder="Primary Color" onSearch={this.onChange} enterButton="Update" /></Col>
      </Row>
    );
  }
}
export default ColorInput;
