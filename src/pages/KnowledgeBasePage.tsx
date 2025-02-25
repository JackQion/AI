import React from 'react';
import { Book, FileText, Video, Download } from 'lucide-react';

interface KnowledgeBasePageProps {
  currentSection: string;
  onKnowledgeCenterClick: () => void;
}

export default function KnowledgeBasePage({ currentSection, onKnowledgeCenterClick }: KnowledgeBasePageProps) {
  return (
    <div className="h-full bg-white p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Book className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold">知识库</h1>
      </div>
      
      {currentSection === 'documents' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">文档中心</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['用户指南', '开发文档', 'API参考', '最佳实践', '常见问题', '故障排除'].map((title) => (
              <div key={title} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-gray-600">查看详细的{title}文档...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentSection === 'tutorials' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">教程中心</h2>
          <div className="space-y-4">
            {['入门指南', '进阶教程', '视频教学', '实战案例'].map((title) => (
              <div key={title} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-3">学习{title}相关内容...</p>
                <button className="text-sm text-blue-500 hover:text-blue-600">
                  开始学习 →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentSection === 'resources' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">资源下载</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['模板下载', '工具包', '示例代码', '电子书'].map((title) => (
              <div key={title} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-3">下载{title}相关资源...</p>
                <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  下载
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div 
        className="fixed bottom-8 right-8"
        onClick={onKnowledgeCenterClick}
      >
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
          <Book size={20} />
          <span>知识中心</span>
        </button>
      </div>
    </div>
  );
}