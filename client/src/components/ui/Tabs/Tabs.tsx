import { useState } from 'react';
import type { ReactNode } from 'react';

import classes from './Tabs.module.css';
import { TabsContext, useTabsContext } from './TabsContext';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
}

const Tabs = ({ defaultValue, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={classes.root}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children }: { children: ReactNode }) => {
  return <div className={classes.list}>{children}</div>;
};

interface TabProps {
  value: string;
  children: ReactNode;
}

const TabsTab = ({ value, children }: TabProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button className={classes.tab} data-active={isActive} onClick={() => setActiveTab(value)}>
      {children}
    </button>
  );
};

interface PanelProps {
  value: string;
  children: ReactNode;
}

const TabsPanel = ({ value, children }: PanelProps) => {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return <div className={classes.panel}>{children}</div>;
};

Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

export default Tabs;
