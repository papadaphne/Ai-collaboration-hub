import React, { useState } from 'react';
import { AgentName } from '../types';
import { AGENTS } from '../constants';
import { SpinnerIcon } from './icons';

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (title: string, description: string, agentName: AgentName) => Promise<void>;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [agentName, setAgentName] = useState<AgentName>(AGENTS[0].name);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim() && !isLoading) {
      setIsLoading(true);
      try {
        await onCreate(title, description, agentName);
        // The parent component will handle closing the modal on success.
      } catch (error) {
        console.error("Failed to create task from modal", error);
        // On failure, allow the user to try again.
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-lg border border-brand-border">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Create New Task</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-brand-text-secondary mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-brand-text-secondary mb-1">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  required
                  disabled={isLoading}
                ></textarea>
              </div>
              <div>
                <label htmlFor="agent" className="block text-sm font-medium text-brand-text-secondary mb-1">Assign to Agent</label>
                <select
                  id="agent"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value as AgentName)}
                  className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  disabled={isLoading}
                >
                  {AGENTS.map(agent => (
                    <option key={agent.name} value={agent.name}>{agent.name} - {agent.role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-brand-primary px-6 py-4 flex justify-end gap-4 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-brand-border text-brand-text-primary rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-brand-accent text-white font-bold rounded-md hover:bg-blue-500 transition-colors w-36 disabled:bg-blue-800 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
