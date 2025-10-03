// src/services/orchestrationService.ts
import { GoogleGenAI } from "@google/genai";
import { Octokit } from "@octokit/rest";
import axios from "axios";
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
        switch (agentName) {
            case "ChatGPT": // Replaced OpenAI with Gemini for documentation
                const geminiResponseDocs = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate documentation and architecture notes for the following task.\n${prompt}`,
                });
                content = geminiResponseDocs.text;
                break;

            case "DeepSeek":
                const deepSeekResponse = await axios.post("https://api.deepseek.com/v1/chat/completions", {
                    model: "deepseek-coder",
                    messages: [{ role: "user", content: `Generate an algorithm or backend code for the following task.\n${prompt}` }],
                }, { headers: { "Authorization": `Bearer ${API_KEYS.DEEPSEEK}` } });
                content = deepSeekResponse.data.choices[0].message.content;
                break;

            case "ComputerX AI":
                const geminiResponseQA = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate a QA test plan and automated test scripts for the following task.\n${prompt}`,
                });
                content = geminiResponseQA.text;
                break;
            
            case "Google AI Studio":
                const geminiResponseCiCd = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate a GitHub Actions workflow file (.yml) for CI/CD related to the following task.\n${prompt}`,
                });
                content = geminiResponseCiCd.text;
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
