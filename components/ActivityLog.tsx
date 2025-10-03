import React from 'react';
import type { LogEntry } from '../types';
import { LogType } from '../types';
import { TaskIcon, AiIcon, GithubIcon, CiCdIcon, SystemIcon } from './icons';
import { AGENTS } from '../constants';

interface ActivityLogProps {
  logs: LogEntry[];
}

const LogTypeConfig = {
    [LogType.Task]: { icon: TaskIcon, color: 'text-blue-400' },
    [LogType.AI]: { icon: AiIcon, color: 'text-purple-400' },
    [LogType.GitHub]: { icon: GithubIcon, color: 'text-gray-300' },
    [LogType.CI]: { icon: CiCdIcon, color: 'text-yellow-400' },
    [LogType.System]: { icon: SystemIcon, color: 'text-green-400' }
};

const getAgentColor = (agentName: string | undefined): string => {
    if (!agentName) return 'text-brand-text-secondary';
    const agent = AGENTS.find(a => a.name === agentName);
    return agent ? agent.color.split(' ')[1] : 'text-brand-text-secondary';
}

const LogItem: React.FC<{ log: LogEntry }> = ({ log }) => {
    const config = LogTypeConfig[log.type];
    const Icon = config.icon;
    const agentColor = getAgentColor(log.meta?.agentName);

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    return (
        <div className="flex items-start gap-3">
            <div className={`mt-1 flex-shrink-0 w-5 h-5 ${config.color}`}>
                <Icon />
            </div>
            <div className="flex-1">
                <p className="text-sm text-brand-text-primary">
                  <span dangerouslySetInnerHTML={{ __html: log.message.replace(log.meta?.agentName, `<strong class="${agentColor}">${log.meta?.agentName}</strong>`) }} />
                  {(log.type === LogType.GitHub || log.type === LogType.CI) && log.meta?.url && (
                    <a href={log.meta.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline ml-2">[View Commit]</a>
                  )}
                </p>
                <time className="text-xs text-brand-text-secondary">{formatTime(log.timestamp)}</time>
            </div>
        </div>
    )
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  return (
    <div className="bg-brand-secondary rounded-lg p-4 flex-1 overflow-y-auto border border-brand-border">
      <div className="space-y-4">
        {logs.map(log => <LogItem key={log.id} log={log}/>)}
        {logs.length === 0 && (
             <div className="text-center text-brand-text-secondary pt-10">Activity feed is empty.</div>
        )}
      </div>
    </div>
  );
};
