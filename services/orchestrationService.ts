// src/services/orchestrationService.ts
import axios from "axios";
import { Octokit } from "@octokit/rest";
import { Buffer } from 'buffer';

import { API_KEYS, GITHUB_CONFIG } from '../aiConfig';
import type { AgentName } from '../types';
import { generateWithGemini } from "./geminiService";

// Initialize APIs
const octokit = new Octokit({ auth: GITHUB_CONFIG.TOKEN });

export const callAI = async (agentName: AgentName, taskTitle: string, taskDescription: string): Promise<string> => {
    const prompt = `Task: ${taskTitle}\nDescription: ${taskDescription}`;
    let content: string;

    try {
        switch (agentName) {
            case "ChatGPT":
                const chatGptResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
                    model: "gpt-4",
                    messages: [{ role: "user", content: `Generate documentation and architecture notes for the following task.\n${prompt}` }],
                }, { headers: { "Authorization": `Bearer ${API_KEYS.OPENAI}` } });
                content = chatGptResponse.data.choices[0].message.content;
                break;

            case "DeepSeek":
                const deepSeekResponse = await axios.post("https://api.deepseek.com/v1/chat/completions", {
                    model: "deepseek-coder",
                    messages: [{ role: "user", content: `Generate an algorithm or backend code for the following task.\n${prompt}` }],
                }, { headers: { "Authorization": `Bearer ${API_KEYS.DEEPSEEK}` } });
                content = deepSeekResponse.data.choices[0].message.content;
                break;

            case "ComputerX AI":
                content = await generateWithGemini(`Generate a QA test plan and automated test scripts for the following task.\n${prompt}`);
                break;
            
            case "Google AI Studio":
                content = await generateWithGemini(`Generate a GitHub Actions workflow file (.yml) for CI/CD related to the following task.\n${prompt}`);
                break;

            default:
                 throw new Error(`AI agent ${agentName} not implemented.`);
        }
        return content || "";
    } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error(`Error calling ${agentName}:`, errorMessage, error);
        throw new Error(`Failed to get response from ${agentName}: ${errorMessage}`);
    }
};

export const commitToGitHub = async (path: string, content: string, message: string): Promise<string> => {
  try {
      // Check if file exists to get its SHA for updates.
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
            owner: GITHUB_CONFIG.OWNER,
            repo: GITHUB_CONFIG.REPO,
            path,
        });
        if ('sha' in data) {
           sha = data.sha;
        }
      } catch (error: any) {
        if (error.status !== 404) {
            throw error; // re-throw if it's not a "file not found" error
        }
        // File doesn't exist, sha remains undefined, which is correct for creation.
      }

      const response = await octokit.repos.createOrUpdateFileContents({
          owner: GITHUB_CONFIG.OWNER,
          repo: GITHUB_CONFIG.REPO,
          path,
          message,
          content: Buffer.from(content).toString("base64"),
          branch: "main",
          sha, // Pass the sha if updating an existing file
      });
      
      return response.data.commit.html_url;
  } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
      console.error(`Failed to commit to GitHub at path ${path}:`, errorMessage);
      throw new Error(`GitHub commit failed: ${errorMessage}`);
  }
};
