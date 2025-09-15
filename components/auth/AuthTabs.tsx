import React from 'react';

interface AuthTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ currentTab, setCurrentTab }) => (
  <div className="flex my-3">
    <button
      className={`tab-btn mx-2 ${currentTab === 'login' ? 'tab-btn--active' : ''}`}
      onClick={() => setCurrentTab('login')}
    >
      Sign in
    </button>
    <button
      className={`tab-btn mx-2 ${currentTab === 'register' ? 'tab-btn--active' : ''}`}
      onClick={() => setCurrentTab('register')}
    >
      Register
    </button>
  </div>
);