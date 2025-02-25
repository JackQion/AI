import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, FileUp, X, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import type { Message, ChatHistory, UserProfile } from '../App';

interface ChatPageProps {
  selectedChat: ChatHistory | null;
  onMessagesUpdate: (messages: Message[]) => void;
  userProfile: UserProfile | null;
  onLogout?: () => void;
}

export default function ChatPage({ selectedChat, onMessagesUpdate, userProfile, onLogout }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const detectSilence = (analyser: AnalyserNode, threshold = -45) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const volume = 20 * Math.log10(average / 255); // Convert to dB
    
    if (volume < threshold) {
      if (silenceTimer === null) {
        setSilenceTimer(setTimeout(() => {
          stopRecording();
        }, 3000));
      }
    } else {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        setSilenceTimer(null);
      }
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);
    
    // Restore original sensitivity
    const normalizedData = Array.from(dataArray).map(value => {
      const normalized = (value - 128) / 128;
      return normalized;
    });
    setAudioData(normalizedData.slice(0, 50));
    
    detectSilence(analyserRef.current);
    
    animationFrameRef.current = requestAnimationFrame(visualize);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Restore original analyzer settings
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      visualize();
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const message: Message = {
          id: Date.now().toString(),
          content: 'Voice message',
          role: 'user',
          timestamp: new Date().toISOString(),
          file: {
            name: 'voice-message.wav',
            url: audioUrl,
            type: 'audio'
          }
        };

        const newMessages = [...messages, message];
        setMessages(newMessages);
        onMessagesUpdate(newMessages);
        
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioData([]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        setSilenceTimer(null);
      }
    }
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isStreaming) return;

    let userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      userMessage = {
        ...userMessage,
        file: {
          name: selectedFile.name,
          url: fileUrl,
          type: selectedFile.type.split('/')[0]
        }
      };
      setSelectedFile(null);
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    setIsStreaming(true);
    let response = '';
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...newMessages, assistantMessage];
    setMessages(updatedMessages);

    const text = selectedChat
      ? "Continuing our previous conversation. This is a streaming response..."
      : "I'm a simulated AI assistant. This is a streaming response that appears character by character...";
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        response += text[index];
        const currentMessages = updatedMessages.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: response }
            : msg
        );
        setMessages(currentMessages);
        onMessagesUpdate(currentMessages);
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4 flex justify-between items-center">
        <div>
          {selectedChat ? (
            <>
              <h2 className="text-xl font-semibold">{selectedChat.title}</h2>
              <p className="text-sm text-gray-500">Continued from {selectedChat.date}</p>
            </>
          ) : (
            <h2 className="text-xl font-semibold">New Chat</h2>
          )}
        </div>
        {userProfile && (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium hidden md:block">{userProfile.name}</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Handle switch user
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <UserCircle size={16} />
                  <span>Switch User</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className="flex flex-col max-w-[80%]">
              <div
                className={`rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
                {message.file && (
                  <div className="mt-2">
                    {message.file.type === 'audio' ? (
                      <audio controls src={message.file.url} className="max-w-full" />
                    ) : message.file.type === 'image' ? (
                      <img src={message.file.url} alt={message.file.name} className="max-w-full rounded" />
                    ) : (
                      <a
                        href={message.file.url}
                        download={message.file.name}
                        className="text-sm underline"
                      >
                        {message.file.name}
                      </a>
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 px-1">
                {formatTime(new Date(message.timestamp))}
              </span>
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex space-x-2 items-center text-gray-400">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        {selectedFile && (
          <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
            <span className="text-sm truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isStreaming}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            disabled={isStreaming}
          >
            <FileUp size={20} />
          </button>
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 rounded-lg ${
              isRecording
                ? 'text-red-500 hover:text-red-700 animate-pulse'
                : 'text-gray-500 hover:text-gray-700'
            } hover:bg-gray-100`}
            disabled={isStreaming}
          >
            <Mic size={20} />
          </button>
          <button
            type="submit"
            disabled={isStreaming || (!input.trim() && !selectedFile)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {/* Recording Modal */}
      {isRecording && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Recording...</h3>
            </div>
            
            {/* Audio Visualization */}
            <div className="h-32 bg-gray-100 rounded-lg p-4 flex items-center justify-center mb-4">
              <div className="flex items-center space-x-1 w-full h-full">
                {audioData.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500"
                    style={{
                      height: `${Math.abs(value * 100)}%`,
                      transition: 'height 0.1s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={stopRecording}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Stop Recording
            </button>
          </div>
        </div>
      )}
    </div>
  );
}