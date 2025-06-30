import { useState } from 'react';

import TabsComponent from '../Tabs/Tabs';

import SearchTab from './SearchTab/SearchTab';
import RatedPage from './RatedPage/RatedTab';

function App() {
  const [activeTab, setActiveTab] = useState('Search');

  return (
    <div style={{ padding: '20px' }}>
      <TabsComponent activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'Search' && <SearchTab />}
      {activeTab === 'Rated' && <RatedPage />}
    </div>
  );
}

export default App;
