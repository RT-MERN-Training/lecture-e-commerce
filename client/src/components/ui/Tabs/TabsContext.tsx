import { createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const TabsContext = createContext<TabsContextType | null>(null);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be rendered within a Tabs component');
  }
  return context;
};
