import React, { useState } from 'react';
import { Row, Col, Icon } from 'antd';
import { Mobile, Default } from '../Responsive';

import './index.less';



const Navbar = props => {
  const [visible, setVisible] = useState(false);

  return (
    <Header className="app-header">
      <div className="logo">Antd Live Theme</div>
      <Default>{menu}</Default>
      <Mobile>
        <Icon type="bars" size="large" className="nav-icon" onClick={() => setVisible(true)} />
        <Drawer
          title=""
          placement="right"
          closable
          onClose={() => setVisible(false)}
          visible={visible}
          className="nav-drawer"
        >
          <div className="logo">Antd Live Theme</div>
          {menu}
        </Drawer>
      </Mobile>
    </Header>
  );
};

export default Navbar;
