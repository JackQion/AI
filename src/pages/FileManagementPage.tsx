import React, { useState } from 'react';
import { Search, RefreshCw, Upload, ChevronLeft, FileText, MoreHorizontal } from 'lucide-react';

interface FileManagementPageProps {
  selectedItem: string | null;
  onBack: () => void;
}

interface FileItem {
  id: number;
  name: string;
  status: string;
  size: string;
  characters: number;
  createdAt: string;
}

const mockFiles: FileItem[] = [
  {
    id: 1,
    name: 'CRH5-S-D200-01 动车组防冻保温.pdf',
    status: '解析完成',
    size: '40.00 KB',
    characters: 4068,
    createdAt: '2025-02-06 21:31'
  },
  {
    id: 2,
    name: 'CRH380A(L)-S-D200-01B 动车组防冻保温.pdf',
    status: '解析完成',
    size: '32.00 KB',
    characters: 4028,
    createdAt: '2025-02-06 21:31'
  },
  // Add more mock files as needed
];

export default function FileManagementPage({ selectedItem, onBack }: FileManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  const handleFileSelect = (id: number) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === mockFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(mockFiles.map(file => file.id));
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">通用作业指导书</h1>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="请输入关键词搜索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw size={18} className="text-gray-500" />
          </button>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
          <Upload size={18} />
          <span>上传文件</span>
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedFiles.length === mockFiles.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">序号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">解析状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">大小</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字符数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFiles.map((file, index) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText size={18} className="text-red-500 mr-2" />
                    <span className="text-sm text-gray-900">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.size}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.characters}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-500 hover:text-blue-700">预览</button>
                    <button className="text-blue-500 hover:text-blue-700">编辑</button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">Total 23</span>
        <div className="flex items-center space-x-2">
          <select className="border rounded px-2 py-1 text-sm">
            <option>20/page</option>
            <option>50/page</option>
            <option>100/page</option>
          </select>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">&lt;</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
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