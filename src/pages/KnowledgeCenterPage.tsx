import React from 'react';
import { Book, MoreVertical } from 'lucide-react';

interface KnowledgeCenterPageProps {
  onItemSelect: (itemId: string) => void;
}

const knowledgeItems = [
  { id: 'general', title: '通用作业指导书', description: '通用作业指导书' },
  { id: 'wheel', title: '轮对作业指导书', description: '轮对作业指导书' },
  { id: 'repair', title: '临修作业指导书', description: '临修作业指导书' },
  { id: 'rescue', title: '救援作业指导书', description: '救援作业指导书' },
  { id: 'adjustment', title: '调车作业指导书', description: '调车作业指导书' },
  { id: 'crh380a', title: 'CRH380A系列二级修', description: 'CRH380A系列二级修' },
  { id: 'assembly', title: '动车组紧固件扭矩值', description: '动车组紧固件扭矩值' },
  { id: 'crh2', title: 'CRH2系列二级修', description: 'CRH2系列二级修' },
  { id: 'cr400bf', title: 'CR400BF二级修', description: 'CR400BF二级修' },
  { id: 'cr400af', title: 'CR400AF系列二级修', description: 'CR400AF系列二级修' },
  { id: 'report', title: '武汉动车段故障分析报告', description: '2018年1月武汉动车段故障分析报告' },
  { id: 'crh-guide', title: 'CRH指导书一级修', description: 'CRH指导书一级修' },
];

export default function KnowledgeCenterPage({ onItemSelect }: KnowledgeCenterPageProps) {
  return (
    <div className="h-full bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Book className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">我的知识库</h1>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          新建知识库
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {knowledgeItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemSelect(item.id)}
            className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:bg-gray-200 rounded-full">
                <MoreVertical size={16} className="text-gray-500" />
              </button>
            </div>
            <h3 className="font-medium mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}