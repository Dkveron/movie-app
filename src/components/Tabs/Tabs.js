import React from 'react';
import { Tabs } from 'antd';

const TabsComponent = ({ activeTab, onTabChange }) => {
  return (
    <Tabs activeKey={activeTab} onChange={onTabChange} centered>
      <Tabs.TabPane tab="Search" key="Search" />
      <Tabs.TabPane tab="Rated" key="Rated" />
    </Tabs>
  );
};

export default TabsComponent;
