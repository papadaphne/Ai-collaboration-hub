
import type { Agent } from './types';
import { AgentName, TaskStatus } from './types';
import { DeepSeekIcon, ComputerXIcon, GoogleAiIcon } from './components/icons';

export const AGENTS: Agent[] = [
  { 
    name: AgentName.DeepSeek, 
    role: "Algorithms & Pricing Engine", 
    repoFolder: "backend/", 
    color: "bg-blue-500/20 text-blue-400",
    icon: DeepSeekIcon
  },
  { 
    name: AgentName.ComputerX, 
    role: "Automated Testing & QA", 
    repoFolder: "tests/", 
    color: "bg-purple-500/20 text-purple-400",
    icon: ComputerXIcon
  },
  { 
    name: AgentName.GoogleAI, 
    role: "Orchestration & Deployment", 
    repoFolder: ".github/workflows/", 
    color: "bg-yellow-500/20 text-yellow-400",
    icon: GoogleAiIcon
  },
];

export const KANBAN_COLUMNS: TaskStatus[] = [
  TaskStatus.Backlog,
  TaskStatus.InProgress,
  TaskStatus.Done,
];