import React, { Component } from 'react';
import {
  Form, Select, Switch, Radio,
  Slider, Button, Upload, Icon, Rate, DatePicker
} from 'antd';

import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class MyForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Select[multiple]"
        >
          {getFieldDecorator('select-multiple', {
            initialValue: ['red'],
            rules: [
              { required: true, message: 'Please select your favourite colors!', type: 'array' },
            ],
          })(
            <Select mode="multiple" placeholder="Please select favourite colors" value={['red']}>
              <Option value="red">Red</Option>
              <Option value="green">Green</Option>
              <Option value="blue">Blue</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Switch"
        >
          {getFieldDecorator('switch', { valuePropName: 'checked', initialValue: true, })(
            <Switch />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Radio.Group"
        >
          {getFieldDecorator('radio-group', { initialValue: 1 })(
            <RadioGroup>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Radio.Button"
        >
          {getFieldDecorator('radio-button', { initialValue: 'a' })(
            <RadioGroup>
              <RadioButton value="a">item 1</RadioButton>
              <RadioButton value="b">item 2</RadioButton>
              <RadioButton value="c">item 3</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Date"
        >
          {getFieldDecorator('date', {
            initialValue: moment(),
          })(
            <DatePicker />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Upload"
        >
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button>
                <Icon type="upload" /> Click to upload
                </Button>
            </Upload>
          )}
        </FormItem>
        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="default" >Cancel</Button>  <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(MyForm);
