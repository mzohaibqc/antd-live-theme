import React from 'react';
import { message } from 'antd';
import 'rc-color-picker/assets/index.css';


class ThemeProvider extends React.Component {
  state = { vars: this.props.vars }

  componentDidMount = () => {
    this.handleColorChange()
  }
  loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  handleColorChange = (varname, color) => {
    const vars = this.state.vars;
    if (varname) vars[varname] = color;
    window.less.modifyVars(vars).then(() => {
      // message.success(`Theme updated successfully`);
      this.setState({ vars });
    }).catch(error => {
      message.error(`Failed to update theme`);
    });
  }

  onChangeComplete = (varname, color) => {
    this.handleColorChange(varname, color);
  }

  render() {
    return null;
  }
}

export default ThemeProvider;
