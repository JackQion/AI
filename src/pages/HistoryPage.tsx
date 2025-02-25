import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import type { ChatHistory } from '../App';

interface HistoryPageProps {
  chatHistory: ChatHistory[];
  onChatSelect: (chat: ChatHistory) => void;
}

export default function HistoryPage({ chatHistory, onChatSelect }: HistoryPageProps) {
  return (
    <div className="h-full bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">Chat History</h1>
      <div className="space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>No chat history yet. Start a new conversation!</p>
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
                {chat.messages.length} messages
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}