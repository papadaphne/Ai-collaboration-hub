import * as React from 'react';

export enum AgentName {
  ChatGPT = "ChatGPT",
  DeepSeek = "DeepSeek",
  ComputerX = "ComputerX AI",
  GoogleAI = "Google AI Studio",
}

export enum TaskStatus {
  Backlog = "Backlog",
  InProgress = "In Progress",
  Done = "Done",
}

export interface Agent {
  name: AgentName;
  role: string;
  repoFolder: string;
  color: string;
  // Fix: Replaced JSX.Element with React.ReactElement to resolve JSX namespace error.
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  agentName: AgentName;
  createdAt: string;
  progress?: number; // New field for progress percentage
  progressStatus?: string; // New field for real-time progress
  error?: string; // New field for error messages
}

export enum LogType {
  Task = "Task",
  AI = "AI",
  GitHub = "GitHub",
  CI = "CI/CD",
  System = "System"
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: LogType;
  meta?: Record<string, any>;
}

export interface User {
  displayName: string;
  email: string;
  photoURL: string;
}