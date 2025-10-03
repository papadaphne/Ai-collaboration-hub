import React from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

const statusConfig = {
    [TaskStatus.Backlog]: { color: 'border-gray-500', title: 'Backlog' },
    [TaskStatus.InProgress]: { color: 'border-blue-500', title: 'In Progress' },
    [TaskStatus.Done]: { color: 'border-green-500', title: 'Done' }
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks }) => {
  const { color, title } = statusConfig[status];

  return (
    <div className={`bg-brand-secondary rounded-lg p-4 flex flex-col border-t-4 ${color} h-full overflow-y-auto`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-brand-text-primary">{title}</h3>
        <span className="bg-brand-primary text-brand-text-secondary text-sm font-bold px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-4 overflow-y-auto flex-1 pr-1">
        {tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
             <div className="text-center text-brand-text-secondary pt-10">No tasks here.</div>
        )}
      </div>
    </div>
  );
};
