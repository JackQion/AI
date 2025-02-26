import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, LogOut, ChevronDown } from 'lucide-react';
import type { UserProfile } from '../App';

interface UserMenuProps {
  userProfile: UserProfile | null;
  onLogout?: () => void;
}

export default function UserMenu({ userProfile, onLogout }: UserMenuProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!userProfile) return null;

  return (
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
            <span>切换用户</span>
          </button>
          <button
            onClick={() => {
              setShowUserMenu(false);
              onLogout?.();
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>退出</span>
          </button>
        </div>
      )}
    </div>
  );
}