import React, { Component } from 'react';
import { message } from 'antd';
import VarColorPicker from './VarColorPicker';
import 'rc-color-picker/assets/index.css';


class ThemeProvider extends Component {
    state = { vars: this.props.vars }
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
        const changeColor = () => {
            const vars = this.state.vars;
            vars[varname] = color;
            window.less.modifyVars(vars).then(() => {
                message.success(`Theme updated successfully`);
                this.setState({ vars });
            });
        };

        const lessUrl = 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js';

        if (this.lessLoaded) {
            changeColor();
        } else {
            window.less = {
                async: true,
            };
            this.loadScript(lessUrl).then(() => {
                this.lessLoaded = true;
                changeColor();
            });
        }
    }

    render() {
        const colorPickers = Object.keys(this.state.vars).map(varName =>  {
            return (
                <VarColorPicker key={varName} defaultColor={this.state.vars[varName]} varName={varName} handleColorChange={this.handleColorChange} />
            );
        })
        return colorPickers;
    }
}

export default ThemeProvider;
