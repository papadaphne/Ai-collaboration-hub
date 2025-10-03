import React from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { AGENTS } from '../constants';
import { SpinnerIcon, ErrorIcon } from './icons';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const agent = AGENTS.find(a => a.name === task.agentName);

  if (!agent) return null;
  
  const AgentIcon = agent.icon;

  const hasError = task.error && task.status === TaskStatus.Backlog;

  return (
    <div className={`bg-brand-primary border rounded-lg p-4 shadow-lg transition-all duration-200 ${hasError ? 'border-red-500/50' : 'border-brand-border hover:border-brand-accent'}`}>
      <h4 className="font-bold text-brand-text-primary mb-2">{task.title}</h4>
      <p className="text-sm text-brand-text-secondary mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center gap-2 text-xs min-h-[24px]">
        {hasError ? (
          <div className="flex items-center gap-2 text-red-400">
            <ErrorIcon className="w-4 h-4" />
            <span className="font-semibold truncate" title={task.error}>Error: {task.error}</span>
          </div>
        ) : task.status === TaskStatus.InProgress ? (
          <div className="w-full">
            <div className="flex justify-between items-center text-xs text-yellow-400 mb-1">
              <div className="flex items-center gap-1.5">
                <SpinnerIcon className="w-3 h-3 animate-spin"/>
                <span className="font-semibold truncate" title={task.progressStatus}>{task.progressStatus || 'In Progress...'}</span>
              </div>
              <span className="font-bold">{task.progress || 0}%</span>
            </div>
            <div className="w-full bg-brand-secondary rounded-full h-1.5 border border-brand-border">
                <div className="bg-yellow-400 h-1 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${task.progress || 0}%` }}></div>
            </div>
          </div>
        ) : (
          <div className={`flex items-center gap-2 py-1 px-2 rounded-full ${agent.color}`}>
            <AgentIcon className="w-4 h-4" />
            <span className="font-semibold">{agent.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};