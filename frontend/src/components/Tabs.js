import React, { useState } from 'react';

function Tabs({ 
  tabs = [], 
  defaultTab = 0,
  className = '',
  tabClassName = '',
  contentClassName = '',
  onChange
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };
  
  return (
    <div className={className}>
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 font-medium ${
              activeTab === index
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            } ${tabClassName}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`pt-4 ${contentClassName}`}>
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
}

export default Tabs;