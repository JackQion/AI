import React, { useState } from 'react';
import {
  MessageSquare,
  History,
  Book,
  FileText,
  Video,
  Download,
  Search as SearchIcon,
} from 'lucide-react';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import KnowledgeCenterPage from './pages/KnowledgeCenterPage';
import FileManagementPage from './pages/FileManagementPage';
import SearchPage from './pages/SearchPage';
import SearchResultsPage from './pages/SearchResultsPage';

export interface ChatHistory {
  id: number;
  title: string;
  preview: string;
  date: string;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: string;
}

type Page =
  | 'chat'
  | 'history'
  | 'knowledge'
  | 'knowledge-center'
  | 'file-management'
  | 'search'
  | 'search-results';
type KnowledgeSection =
  | 'documents'
  | 'tutorials'
  | 'resources'
  | 'knowledge-center';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('chat');
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showKnowledgeSubmenu, setShowKnowledgeSubmenu] = useState(false);
  const [currentKnowledgeSection, setCurrentKnowledgeSection] =
    useState<KnowledgeSection>('documents');
  const [selectedKnowledgeItem, setSelectedKnowledgeItem] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (username: string, password: string) => {
    if (username && password) {
      setIsAuthenticated(true);
      setUserProfile({
        name: username,
        email: `${username}@example.com`,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setSelectedChat(null);
    setChatHistory([]);
  };

  const handleChatSelect = (chat: ChatHistory) => {
    setSelectedChat(chat);
    setCurrentPage('chat');
  };

  const handleNewMessage = (messages: Message[]) => {
    if (selectedChat) {
      const updatedHistory = chatHistory.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages,
              preview: messages[messages.length - 1].content,
            }
          : chat
      );
      setChatHistory(updatedHistory);
      setSelectedChat({ ...selectedChat, messages });
    } else if (messages.length > 0) {
      const newChat: ChatHistory = {
        id: Date.now(),
        title: `Chat ${chatHistory.length + 1}`,
        preview: messages[messages.length - 1].content,
        date: new Date().toISOString().split('T')[0],
        messages,
      };
      setChatHistory([newChat, ...chatHistory]);
      setSelectedChat(newChat);
    }
  };

  const handleKnowledgeItemSelect = (itemId: string) => {
    setSelectedKnowledgeItem(itemId);
    setCurrentPage('file-management');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search-results');
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case 'chat':
        return (
          <ChatPage
            selectedChat={selectedChat}
            onMessagesUpdate={handleNewMessage}
            userProfile={userProfile}
            onLogout={handleLogout}
          />
        );
      case 'history':
        return (
          <HistoryPage
            chatHistory={chatHistory}
            onChatSelect={handleChatSelect}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeBasePage
            currentSection={currentKnowledgeSection}
            onKnowledgeCenterClick={() => {
              setCurrentPage('knowledge-center');
              setCurrentKnowledgeSection('knowledge-center');
            }}
          />
        );
      case 'knowledge-center':
        return <KnowledgeCenterPage onItemSelect={handleKnowledgeItemSelect} />;
      case 'file-management':
        return (
          <FileManagementPage
            selectedItem={selectedKnowledgeItem}
            onBack={() => {
              setCurrentPage('knowledge-center');
              setSelectedKnowledgeItem(null);
            }}
          />
        );
      case 'search':
        return <SearchPage onSearch={handleSearch} />;
      case 'search-results':
        return (
          <SearchResultsPage
            query={searchQuery}
            onBack={() => setCurrentPage('search')}
          />
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return <RegisterPage onBack={() => setShowRegister(false)} />;
    }
    return <LoginPage onLogin={handleLogin} onRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-full ${
          isSidebarExpanded ? 'md:w-48' : 'md:w-16'
        } bg-gray-900 flex md:flex-col items-center justify-between md:justify-start p-4 md:py-4 transition-all duration-300`}
      >
        {/* BRI Logo */}
        <div
          onDoubleClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="w-10 h-10 mb-6 cursor-pointer rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition-colors select-none"
        >
          <span className="text-white font-bold text-lg">BRI</span>
        </div>

        <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 w-full">
          <button
            onClick={() => {
              setCurrentPage('chat');
              setSelectedChat(null);
              setShowKnowledgeSubmenu(false);
            }}
            className={`p-3 rounded-lg w-full flex items-center ${
              isSidebarExpanded ? 'space-x-3' : 'justify-center'
            } ${
              currentPage === 'chat'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <MessageSquare size={24} />
            {isSidebarExpanded && (
              <span className="text-sm font-medium">聊天对话</span>
            )}
          </button>

          <button
            onClick={() => setCurrentPage('search')}
            className={`p-3 rounded-lg w-full flex items-center ${
              isSidebarExpanded ? 'space-x-3' : 'justify-center'
            } ${
              currentPage === 'search' || currentPage === 'search-results'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <SearchIcon size={24} />
            {isSidebarExpanded && (
              <span className="text-sm font-medium">智能搜索</span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentPage('history');
              setShowKnowledgeSubmenu(false);
            }}
            className={`p-3 rounded-lg w-full flex items-center ${
              isSidebarExpanded ? 'space-x-3' : 'justify-center'
            } ${
              currentPage === 'history'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <History size={24} />
            {isSidebarExpanded && (
              <span className="text-sm font-medium">历史记录</span>
            )}
          </button>

          {/* Knowledge Base Button */}
          <div className="w-full">
            <button
              onClick={() => {
                setCurrentPage('knowledge');
                setShowKnowledgeSubmenu(!showKnowledgeSubmenu);
              }}
              className={`p-3 rounded-lg w-full flex items-center ${
                isSidebarExpanded ? 'space-x-3' : 'justify-center'
              } ${
                currentPage === 'knowledge' ||
                currentPage === 'knowledge-center' ||
                currentPage === 'file-management'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Book size={24} />
              {isSidebarExpanded && (
                <span className="text-sm font-medium">知识库</span>
              )}
            </button>

            {/* Knowledge Base Submenu */}
            {showKnowledgeSubmenu && isSidebarExpanded && (
              <div className="ml-4 mt-2 space-y-1">
                <button
                  onClick={() => {
                    setCurrentKnowledgeSection('documents');
                    setCurrentPage('knowledge');
                  }}
                  className={`w-full p-2 rounded-lg flex items-center space-x-2 text-sm ${
                    currentKnowledgeSection === 'documents'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <FileText size={18} />
                  <span>文档中心</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentKnowledgeSection('tutorials');
                    setCurrentPage('knowledge');
                  }}
                  className={`w-full p-2 rounded-lg flex items-center space-x-2 text-sm ${
                    currentKnowledgeSection === 'tutorials'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Video size={18} />
                  <span>教程中心</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentKnowledgeSection('resources');
                    setCurrentPage('knowledge');
                  }}
                  className={`w-full p-2 rounded-lg flex items-center space-x-2 text-sm ${
                    currentKnowledgeSection === 'resources'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Download size={18} />
                  <span>资源下载</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentKnowledgeSection('knowledge-center');
                    setCurrentPage('knowledge-center');
                  }}
                  className={`w-full p-2 rounded-lg flex items-center space-x-2 text-sm ${
                    currentKnowledgeSection === 'knowledge-center'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Book size={18} />
                  <span>知识中心</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{renderMainContent()}</div>
    </div>
  );
}

export default App;