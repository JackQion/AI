import React, { useState } from 'react';
import { Search } from 'lucide-react';
import UserMenu from '../components/UserMenu';
import type { UserProfile } from '../App';

interface SearchPageProps {
  onSearch: (query: string) => void;
  userProfile: UserProfile | null;
  onLogout?: () => void;
}

export default function SearchPage({ onSearch, userProfile, onLogout }: SearchPageProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="h-full bg-white">
      <div className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">智能搜索</h1>
        <UserMenu userProfile={userProfile} onLogout={onLogout} />
      </div>

      <div className="flex flex-col items-center justify-center p-6 flex-1">
        <div className="w-full max-w-3xl text-center">
          <div className="flex items-center justify-center mb-8">
            <Search className="w-12 h-12 text-blue-500" />
            <h1 className="text-3xl font-bold ml-4">智能搜索</h1>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="请输入搜索内容"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 pr-16"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Search size={24} />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">热门搜索</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {['CRH380A', '动车组', '作业指导', '检修规程', '故障处理'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSearch(tag)}
                  className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}