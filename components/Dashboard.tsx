import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Header } from './Header';
import { KanbanBoard } from './KanbanBoard';
import { ActivityLog } from './ActivityLog';
import { CreateTaskModal } from './CreateTaskModal';
import { callAI, commitToGitHub } from '../services/orchestrationService';
import type { Task, LogEntry, User, AgentName } from '../types';
import { TaskStatus, LogType } from '../types';
import { PlusIcon } from './icons';
import { useToast } from '../hooks/useToast';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const tasksQuery = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setTasks(tasksData);
    });

    const logsQuery = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
        const logsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
        setLogs(logsData);
    });

    return () => {
        unsubscribeTasks();
        unsubscribeLogs();
    };
  }, []);
  
  const addLog = async (message: string, type: LogType, meta: object = {}) => {
    await addDoc(collection(db, "logs"), { message, type, meta, timestamp: new Date().toISOString() });
  };

  const processTask = async (taskId: string, title: string, description: string, agentName: AgentName) => {
    const taskDocRef = doc(db, "tasks", taskId);
    
    try {
      // Step 1: Start In Progress
      await updateDoc(taskDocRef, { 
        status: TaskStatus.InProgress, 
        progress: 10,
        progressStatus: `🤖 ${agentName} is working...`, 
        error: "" 
      });
      await addLog(`${agentName} has started working on "${title}".`, LogType.AI, { agentName });

      // Step 2: Calling AI
      await updateDoc(taskDocRef, { progress: 25, progressStatus: `🧠 Generating content with ${agentName}...` });
      const aiContent = await callAI(agentName, title, description);
      await addLog(`${agentName} has completed its work.`, LogType.AI, { agentName });

      // Step 3: Committing to GitHub
      await updateDoc(taskDocRef, { progress: 50, progressStatus: "📦 Committing to GitHub..." });
      const sanitizedTitle = title.toLowerCase().replace(/\s+/g, "-");
      const agentPaths: { [key in AgentName]: string } = {
        "Architect AI": `docs/${sanitizedTitle}-spec-${taskId}.md`,
        "Developer AI": `src/features/${sanitizedTitle}/${taskId}.ts`,
        "QA AI": `tests/unit/${sanitizedTitle}-${taskId}.test.js`,
      };
      const filePath = agentPaths[agentName];
      const commitUrl = await commitToGitHub(filePath, aiContent, `feat: ${title} by ${agentName} (#${taskId})`);
      await addLog(`Successfully committed to GitHub: ${filePath}`, LogType.GitHub, { path: filePath, url: commitUrl });
      
      // Step 4: CI/CD Pipeline
      await updateDoc(taskDocRef, { progress: 75, progressStatus: "🚀 CI/CD pipeline running..." });
      await addLog("CI/CD pipeline triggered by commit.", LogType.CI, { url: commitUrl });
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate build/deploy time
      
      // Step 5: Deployment successful
      await updateDoc(taskDocRef, { progress: 100, progressStatus: "✅ Deployment successful" });
      await addLog("Deployment successful (simulation).", LogType.System);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 6: Done
      await updateDoc(taskDocRef, { status: TaskStatus.Done, progress: 100, progressStatus: "" });
      await addLog(`Task "${title}" is complete.`, LogType.Task);
      showToast(`Task "${title}" completed successfully!`, 'success');

    } catch (error: any) {
      console.error(`Error processing task ${taskId}:`, error);
      const errorMessage = error.message || "An unknown error occurred.";
      
      // Delete the failed task
      await deleteDoc(taskDocRef);
      
      await addLog(`Failed to process task "${title}" and removed it: ${errorMessage}`, LogType.System, { agentName });
      showToast(`Task "${title}" failed and was removed.`, 'error');
    }
  };

  const handleCreateTask = async (title: string, description: string, agentName: AgentName) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title,
        description,
        agentName,
        status: TaskStatus.Backlog,
        createdAt: new Date().toISOString(),
        error: "",
        progress: 0,
      });
      setIsModalOpen(false);
      showToast("Task created and process started.", 'success');
      await addLog(`New task "${title}" created and assigned to ${agentName}.`, LogType.Task, { agentName });

      // Start processing the task asynchronously
      processTask(docRef.id, title, description, agentName);

    } catch (error) {
      console.error("Error creating task: ", error);
      const errorMessage = (error as Error).message;
      await addLog("Failed to create a new task.", LogType.System, { error: errorMessage });
      showToast(`Failed to create task: ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-brand-text-primary">Project Board</h2>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Task
                </button>
            </div>
            <KanbanBoard tasks={tasks} />
        </div>
        <div className="flex flex-col overflow-hidden">
             <h2 className="text-2xl font-semibold text-brand-text-primary mb-4">Activity Feed</h2>
            <ActivityLog logs={logs} />
        </div>
      </main>
      {isModalOpen && <CreateTaskModal onClose={() => setIsModalOpen(false)} onCreate={handleCreateTask} />}
    </div>
  );
};
