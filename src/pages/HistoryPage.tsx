import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import UserMenu from '../components/UserMenu';
import type { ChatHistory, UserProfile } from '../App';

interface HistoryPageProps {
  chatHistory: ChatHistory[];
  onChatSelect: (chat: ChatHistory) => void;
  userProfile: UserProfile | null;
  onLogout?: () => void;
}

export default function HistoryPage({ chatHistory, onChatSelect, userProfile, onLogout }: HistoryPageProps) {
  return (
    <div className="h-full bg-white">
      <div className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">聊天记录</h1>
        <UserMenu userProfile={userProfile} onLogout={onLogout} />
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>暂无聊天记录，开始新的对话吧！</p>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat)}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-lg">{chat.title}</h2>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {chat.date}
                  </div>
                </div>
                <p className="text-gray-600 mb-2 line-clamp-2">{chat.preview}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <MessageSquare size={14} className="mr-1" />
                  {chat.messages.length} 条消息
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}