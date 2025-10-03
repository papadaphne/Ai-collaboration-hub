import React from 'react';
import { GoogleIcon, LogoIcon } from './icons';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-primary p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-8">
            <LogoIcon className="w-24 h-24 text-brand-accent"/>
        </div>
        <h1 className="text-4xl font-bold text-brand-text-primary mb-2">AI Collaboration Hub</h1>
        <p className="text-lg text-brand-text-secondary mb-10">Orchestrate AI agents to build, test, and deploy software.</p>
        <div className="bg-brand-secondary p-8 rounded-lg border border-brand-border shadow-2xl">
          <h2 className="text-2xl font-semibold text-brand-text-primary mb-6">Sign In</h2>
          <p className="text-brand-text-secondary mb-8">
            Use your Google account to access the dashboard and start orchestrating AI agents.
          </p>
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center bg-white text-gray-700 font-medium py-3 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-accent"
          >
            <GoogleIcon className="w-6 h-6 mr-3" />
            Sign in with Google
          </button>
        </div>
        <p className="mt-8 text-sm text-brand-text-secondary">
          Welcome to the future of automated software development.
        </p>
      </div>
    </div>
  );
};
