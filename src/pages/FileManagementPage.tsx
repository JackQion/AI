import React, { useState, useRef, useEffect } from 'react';
import { Search, RefreshCw, Upload, ChevronLeft, FileText, MoreHorizontal, Download, Edit2, Trash2, X } from 'lucide-react';
import UserMenu from '../components/UserMenu';
import type { UserProfile } from '../App';

interface FileManagementPageProps {
  selectedItem: string | null;
  onBack: () => void;
  userProfile: UserProfile | null;
  onLogout?: () => void;
}

interface FileItem {
  id: number;
  name: string;
  status: string;
  size: string;
  characters: number;
  createdAt: string;
}

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

// 文件上传状态接口
interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const RenameModal: React.FC<RenameModalProps> = ({ isOpen, onClose, onRename, currentName }) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== currentName) {
      onRename(newName.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">重命名文件</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              文件名
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入新的文件名"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function FileManagementPage({ selectedItem, onBack, userProfile, onLogout }: FileManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [files, setFiles] = useState<FileItem[]>([
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
  ]);
  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean;
    fileId: number | null;
    fileName: string;
  }>({
    isOpen: false,
    fileId: null,
    fileName: '',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 文件上传相关状态
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 支持的文件类型
  const acceptedFileTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/markdown',
  ];

  const fileExtensions = '.pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.md';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileSelect = (id: number) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.id));
    }
  };

  const handleRename = (fileId: number) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setRenameModal({
        isOpen: true,
        fileId: fileId,
        fileName: file.name,
      });
    }
    setOpenMenuId(null);
  };

  const handleRenameSubmit = (newName: string) => {
    if (renameModal.fileId) {
      setFiles(prevFiles =>
        prevFiles.map(file =>
          file.id === renameModal.fileId
            ? { ...file, name: newName }
            : file
        )
      );
    }
  };

  const handleDelete = (fileId: number) => {
    if (window.confirm('确定要删除这个文件吗？')) {
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
    setOpenMenuId(null);
  };

  const handleBatchDelete = () => {
    if (selectedFiles.length === 0) return;
    
    if (window.confirm(`确定要删除选中的 ${selectedFiles.length} 个文件吗？`)) {
      setFiles(prevFiles => prevFiles.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const handleDownload = (fileId: number) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      // 这里应该实现实际的文件下载逻辑
      console.log('Downloading file:', file.name);
    }
    setOpenMenuId(null);
  };

  const handleBatchDownload = () => {
    if (selectedFiles.length === 0) return;
    
    const selectedFileItems = files.filter(file => selectedFiles.includes(file.id));
    // 这里应该实现实际的批量下载逻辑
    console.log('Downloading files:', selectedFileItems.map(f => f.name));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // 这里应该实现实际的刷新逻辑，从后端获取最新数据
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API请求
      console.log('Refreshing file list...');
    } finally {
      setIsRefreshing(false);
    }
  };

  // 文件上传相关处理函数
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const validateFile = (file: File): string | null => {
    if (file.size > 100 * 1024 * 1024) {
      return '文件大小超过限制（100MB）';
    }
    if (!acceptedFileTypes.includes(file.type)) {
      return '不支持的文件类型';
    }
    return null;
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;

    const newUploadingFiles: UploadingFile[] = [];
    
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        newUploadingFiles.push({
          file,
          progress: 0,
          status: 'error',
          error
        });
      } else {
        newUploadingFiles.push({
          file,
          progress: 0,
          status: 'uploading'
        });
      }
    });

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    setShowUploadModal(true);

    // 模拟上传进度
    newUploadingFiles.forEach((uploadingFile, index) => {
      if (uploadingFile.status === 'error') return;

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadingFiles(prev => 
            prev.map((file, i) => 
              i === index ? { ...file, progress: 100, status: 'success' } : file
            )
          );
          
          // 上传成功后添加到文件列表
          const newFile: FileItem = {
            id: Date.now() + index,
            name: uploadingFile.file.name,
            status: '解析完成',
            size: `${(uploadingFile.file.size / 1024).toFixed(2)} KB`,
            characters: Math.floor(Math.random() * 5000) + 1000, // 模拟字符数
            createdAt: new Date().toLocaleString()
          };
          setFiles(prev => [newFile, ...prev]);
        } else {
          setUploadingFiles(prev => 
            prev.map((file, i) => 
              i === index ? { ...file, progress } : file
            )
          );
        }
      }, 500);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadingFiles.length <= 1) {
      setShowUploadModal(false);
    }
  };

  return (
    <div 
      className="h-full bg-white flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
        <UserMenu userProfile={userProfile} onLogout={onLogout} />
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
          {selectedFiles.length > 0 ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBatchDownload}
                className="px-3 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Download size={18} />
                <span>下载{selectedFiles.length}个文件</span>
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Trash2 size={18} />
                <span>删除{selectedFiles.length}个文件</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw size={18} className="text-gray-500" />
            </button>
          )}
        </div>
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept={fileExtensions}
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
          <button 
            onClick={handleFileUploadClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Upload size={18} />
            <span>上传文件</span>
          </button>
          <div className="absolute hidden group-hover:block w-80 bg-gray-800 text-white text-sm rounded-lg p-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
            点击上传，或拖动文件进来<br />
            支持上传 PDF、TXT、Word、Excel、PPT、图片、Markdown 等<br />
            单个文件大小限制 100MB
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedFiles.length === files.length}
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
            {files.map((file, index) => (
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
                  <div className="flex items-center space-x-3 relative">
                    <button className="text-blue-500 hover:text-blue-700">预览</button>
                    <button className="text-blue-500 hover:text-blue-700">编辑</button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === file.id ? null : file.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenuId === file.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-lg py-1 z-10"
                      >
                        <button
                          onClick={() => handleDownload(file.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Download size={14} />
                          <span>下载</span>
                        </button>
                        <button
                          onClick={() => handleRename(file.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Edit2 size={14} />
                          <span>重命名</span>
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Trash2 size={14} />
                          <span>删除</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">Total {files.length}</span>
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

      {/* Rename Modal */}
      <RenameModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ isOpen: false, fileId: null, fileName: '' })}
        onRename={handleRenameSubmit}
        currentName={renameModal.fileName}
      />

      {/* Upload Progress Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">文件上传</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {uploadingFiles.map((file, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm truncate">{file.file.name}</span>
                    <button
                      onClick={() => removeUploadingFile(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {file.status === 'error' ? (
                    <div className="text-red-500 text-sm">{file.error}</div>
                  ) : (
                    <>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {file.status === 'success' ? '上传完成' : `${Math.round(file.progress)}%`}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div 
          ref={dropZoneRef}
          className="fixed inset-0 bg-blue-500 bg-opacity-10 border-4 border-blue-500 border-dashed z-50 flex items-center justify-center"
        >
          <div className="text-2xl font-semibold text-blue-500">
            释放文件以上传
          </div>
        </div>
      )}
    </div>
  );
}