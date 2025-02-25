import React, { useState } from 'react';
import { ChevronLeft, FileText, Download, Search } from 'lucide-react';

interface SearchResultsPageProps {
  query: string;
  onBack: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: string;
  size: string;
  characters: number;
  date: string;
  preview: string;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'CR400BF-M1-二级修A包.pdf',
    type: 'pdf',
    size: '31.76 MB',
    characters: 176284,
    date: '2025-02-05T15:21:43Z',
    preview: 'CR400BF-M1-二级修A包.pdf的CR400BF 动车组作业指导书 页 码 7 / 23 编 号 CR400BF-M1-2000-002 版 本 V1.0(武) 作业项目 前端部件及车钩检查 序号 作业项目 作业内容、标准及图示 ①车钩防尘套外观状态良好, 无裂纹破损, 防尘套挂钩无裂纹损...'
  },
  {
    id: '2',
    title: 'CRH380A系列二级修A包.pdf',
    type: 'pdf',
    size: '14.65 MB',
    characters: 173202,
    date: '2025-02-06T13:16:16Z',
    preview: 'CRH380A系列二级修A包.pdf的CRH 动车组作业指导书 页 码 18/14 编 号 CRH380A(L)-M1-2200-01 版 本 V6.1 (武) 作业项目 前端车钩及头罩开机构检测温 清序号 作业项目 作业内容、标准及图示 3) 检查解钩手柄吊挂在吊耳处, 钢丝绳绷处于...'
  },
  {
    id: '3',
    title: 'CRH2-M1-二级修A包（适用于2B型）.pdf',
    type: 'pdf',
    size: '28.92 MB',
    characters: 168456,
    date: '2025-02-06T14:30:00Z',
    preview: 'CRH2系列动车组二级修作业指导书...'
  }
];

export default function SearchResultsPage({ query, onBack }: SearchResultsPageProps) {
  const [timeFilter, setTimeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchInput, setSearchInput] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchInput);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">搜索</h1>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="请输入搜索内容"
                className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={20} />
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              搜索
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 border rounded-lg"
          >
            <option value="all">全部类型</option>
            <option value="pdf">PDF文档</option>
            <option value="doc">Word文档</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-1.5 border rounded-lg"
          >
            <option value="all">时间不限</option>
            <option value="day">最近24小时</option>
            <option value="week">最近一周</option>
            <option value="month">最近一月</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-6">
        <p className="text-sm text-gray-500 mb-4">
          找到 {mockResults.length} 个与 "{query}" 相关的结果
        </p>

        <div className="space-y-6">
          {mockResults.map((result) => (
            <div key={result.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FileText size={24} className="text-red-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-lg text-blue-500 hover:underline cursor-pointer">
                      {result.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{result.size}</span>
                      <span>{result.characters} 字符</span>
                      <span>{new Date(result.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600">
                  <Download size={18} />
                  <span>下载</span>
                </button>
              </div>
              <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                {result.preview}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="border-t px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">Total 8</span>
        <div className="flex items-center space-x-2">
          <select className="border rounded px-2 py-1 text-sm">
            <option>100/page</option>
            <option>50/page</option>
            <option>20/page</option>
          </select>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">&lt;</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">&gt;</button>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500">Go to</span>
            <input type="number" className="w-16 border rounded px-2 py-1 text-sm" defaultValue={1} />
          </div>
        </div>
      </div>
    </div>
  );
}