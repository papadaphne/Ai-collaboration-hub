
import React from 'react';
import type { User } from '../types';
import { LogoIcon } from './icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-brand-secondary border-b border-brand-border sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <LogoIcon className="w-8 h-8 text-brand-accent" />
        <h1 className="text-xl font-bold text-brand-text-primary">AI Collaboration Hub</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-sm text-brand-text-primary">{user.displayName}</p>
          <p className="text-xs text-brand-text-secondary">{user.email}</p>
        </div>
        <img
          src={user.photoURL}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-brand-border"
        />
        <button
          onClick={onLogout}
          className="bg-brand-border hover:bg-red-500/50 text-brand-text-secondary hover:text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
