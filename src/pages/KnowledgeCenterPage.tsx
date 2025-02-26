import React, { useState, useRef, useEffect } from 'react';
import { Book, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import UserMenu from '../components/UserMenu';
import { getKnowledgeListParams, createKonwledge } from '../services/knowledge';
import type { UserProfile } from '../App';
import { message } from 'antd';

interface KnowledgeCenterProps {
  onItemSelect: (itemId: string) => void;
  userProfile: UserProfile | null;
  onLogout?: () => void;
}

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
}

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, title: string, description: string) => void;
  mode: 'new' | 'edit';
  item?: KnowledgeItem;
  fetchKnowledgeList: () => void; // 将 fetchKnowledgeList 作为 prop 传递
}

const KnowledgeModal: React.FC<KnowledgeModalProps> = ({ isOpen, onClose, onSave, mode, item, fetchKnowledgeList }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createKonwledge({
        name: title,
        description: description,
      });

      if (response.data.success) {
        message.success('知识库创建成功');
        fetchKnowledgeList();  // 调用传递下来的方法刷新知识库列表
        onClose(); // 关闭弹窗
      } else {
        message.error('知识库创建失败');
      }
    } catch (error) {
      message.error('创建知识库失败');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          {mode === 'new' ? '新建知识库' : '编辑知识库'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              知识库名称
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入知识库名称"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              知识库简介
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="请输入知识库简介"
              required
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
              {mode === 'new' ? '创建' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function KnowledgeCenterPage({ onItemSelect, userProfile, onLogout }: KnowledgeCenterProps) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'new' | 'edit';
    item?: KnowledgeItem;
  }>({
    isOpen: false,
    mode: 'new',
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // 获取知识库列表
  const fetchKnowledgeList = async () => {
    try {
      const response = await getKnowledgeListParams({
        Authorization: sessionStorage.getItem('api_key') || '',
      });

      const res = response.data;
      if (res.success === true) {
        message.success('获取知识库列表成功');
        const knowledgeBaseList = response.data.data.knowledge_bases;
        const list = knowledgeBaseList.map((base: any) => ({
          id: base.id,
          title: base.name,
          description: base.description,
        }));

        setKnowledgeItems(list);
      } else {
        message.error('初始化知识库列表失败');
      }
    } catch (error) {
      message.error('初始化知识库列表失败');
      console.error('初始化知识库列表失败:', error);
    }
  };

  useEffect(() => {
    fetchKnowledgeList(); // 初次加载时调用
  }, []);

  const handleEdit = (item: KnowledgeItem) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      item,
    });
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个知识库吗？')) {
      setKnowledgeItems((items) => items.filter((item) => item.id !== id));
    }
    setOpenMenuId(null);
  };

  const handleSave = (id: string, title: string, description: string) => {
    if (modalState.mode === 'new') {
      const newItem: KnowledgeItem = {
        id: id,
        title,
        description,
      };
      setKnowledgeItems((items) => [newItem, ...items]);
    } else if (modalState.item) {
      setKnowledgeItems((items) =>
        items.map((item) =>
          item.id === modalState.item?.id ? { ...item, title, description } : item
        )
      );
    }
    setModalState({ isOpen: false, mode: 'new' });
  };

  return (
    <div className="h-full bg-white">
      <div className="border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Book className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">我的知识库</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setModalState({ isOpen: true, mode: 'new' })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            新建知识库
          </button>
          <UserMenu userProfile={userProfile} onLogout={onLogout} />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {knowledgeItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
            >
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === item.id ? null : item.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <MoreVertical size={16} className="text-gray-500" />
                </button>
                {openMenuId === item.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg py-1 z-10"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Edit2 size={14} />
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Trash2 size={14} />
                      <span>删除</span>
                    </button>
                  </div>
                )}
              </div>
              <div onClick={() => onItemSelect(item.id)}>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <KnowledgeModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'new' })}
        onSave={handleSave}
        mode={modalState.mode}
        item={modalState.item}
        fetchKnowledgeList={fetchKnowledgeList}  // 传递 fetchKnowledgeList 函数
      />
    </div>
  );
}
