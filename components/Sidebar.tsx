/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

type Tab = 'edit' | 'portrait' | 'creative' | 'adjust';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onUploadNew: () => void;
  tabs: { id: Tab; label:string; Icon: React.FC<{className?: string}>, title: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onUploadNew, tabs }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900/60 backdrop-blur-sm border-r border-gray-700/50 p-4 flex flex-col gap-6">
      {/* Navigation */}
      <nav className="flex flex-col gap-2 pt-4">
        {tabs.map(({ id, label, Icon, title }) => (
          <button
            key={id}
            title={title}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-4 w-full capitalize font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-base text-left ${
                activeTab === id
                ? 'bg-blue-500/20 text-blue-300'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={onUploadNew}
          className="w-full text-center bg-white/10 border border-white/20 text-gray-200 font-semibold py-3 px-5 rounded-md transition-all duration-200 ease-in-out hover:bg-white/20 hover:border-white/30 active:scale-95 text-base"
          title="Start over with a new image"
        >
          Upload New Image
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;