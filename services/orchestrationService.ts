// src/services/orchestrationService.ts
import { GoogleGenAI } from "@google/genai";
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";
import { API_KEYS, GITHUB_CONFIG } from '../aiConfig';
import type { AgentName } from '../types';

// Initialize API clients
const ai = new GoogleGenAI({ apiKey: API_KEYS.GOOGLE });
const octokit = new Octokit({ auth: GITHUB_CONFIG.TOKEN });

/**
 * Calls the appropriate AI model based on the agent name.
 * All API calls are made directly from the client.
 */
export const callAI = async (agentName: AgentName, taskTitle: string, taskDescription: string): Promise<string> => {
    const prompt = `Task: ${taskTitle}\nDescription: ${taskDescription}`;
    let content: string;

    try {
        let response;
        switch (agentName) {
            case "Architect AI":
                response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate a technical specification document in Markdown for the following software task.\n${prompt}`,
                });
                content = response.text;
                break;

            case "Developer AI":
                response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate the primary source code (e.g., TypeScript/React or Python) to implement the following task.\n${prompt}`,
                });
                content = response.text;
                break;
            
            case "QA AI":
                response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate automated test scripts (e.g., using Jest or Pytest) for the following software task.\n${prompt}`,
                });
                content = response.text;
                break;

            default:
                throw new Error(`AI agent ${agentName} not implemented.`);
        }
        if (!content) {
            throw new Error(`Received empty response from ${agentName}.`);
        }
        return content;
    } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error(`Error calling ${agentName}:`, errorMessage, error);
        throw new Error(`Failed to get response from ${agentName}: ${errorMessage}`);
    }
};

/**
 * Commits a file to a GitHub repository using the GitHub REST API.
 */
export const commitToGitHub = async (path: string, content: string, message: string): Promise<string> => {
    try {
        let sha: string | undefined;

        // Try to get the file to see if it exists and get its SHA for updates
        try {
            const { data: fileData } = await octokit.repos.getContent({
                owner: GITHUB_CONFIG.OWNER,
                repo: GITHUB_CONFIG.REPO,
                path,
            });
            if ("sha" in fileData) {
                sha = fileData.sha;
            }
        } catch (error: any) {
            // If the file doesn't exist (404), we can proceed to create it.
            if (error.status !== 404) {
                throw error;
            }
        }

        const response = await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_CONFIG.OWNER,
            repo: GITHUB_CONFIG.REPO,
            path,
            message,
            content: Buffer.from(content).toString("base64"),
            branch: "main", // Committing to the main branch
            sha, // If sha is undefined, it's a new file. If defined, it's an update.
        });

        return response.data.commit.html_url || "#";
    } catch (error: any) {
        const errorMessage = error.message || "Unknown error";
        console.error(`Failed to commit to GitHub at path ${path}:`, errorMessage);
        throw new Error(`GitHub commit failed: ${errorMessage}`);
    }
};
