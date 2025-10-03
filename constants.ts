
import type { Agent } from './types';
import { AgentName, TaskStatus } from './types';
import { ArchitectIcon, DeveloperIcon, QaIcon } from './components/icons';

export const AGENTS: Agent[] = [
  { 
    name: AgentName.Architect, 
    role: "System Design & Documentation", 
    repoFolder: "docs/", 
    color: "bg-blue-500/20 text-blue-400",
    icon: ArchitectIcon
  },
  { 
    name: AgentName.Developer, 
    role: "Core Feature Implementation", 
    repoFolder: "src/", 
    color: "bg-purple-500/20 text-purple-400",
    icon: DeveloperIcon
  },
  { 
    name: AgentName.QA, 
    role: "Automated Testing & Quality", 
    repoFolder: "tests/", 
    color: "bg-yellow-500/20 text-yellow-400",
    icon: QaIcon
  },
];

export const KANBAN_COLUMNS: TaskStatus[] = [
  TaskStatus.Backlog,
  TaskStatus.InProgress,
  TaskStatus.Done,
];
