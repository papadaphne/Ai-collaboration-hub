import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";

admin.initializeApp();

// Access secrets from Firebase environment configuration
const config = functions.config();
const API_KEYS = {
  OPENAI: config.keys.openai,
  DEEPSEEK: config.keys.deepseek,
  GOOGLE: config.keys.google,
};
const GITHUB_CONFIG = {
  TOKEN: config.github.token,
  OWNER: config.github.owner,
  REPO: config.github.repo,
};

const googleAI = new GoogleGenAI({ apiKey: API_KEYS.GOOGLE });
const octokit = new Octokit({ auth: GITHUB_CONFIG.TOKEN });

export const callAIProxy = functions.https.onCall(async (data, context) => {
  const { agentName, taskTitle, taskDescription } = data;
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
        const geminiResponseQA = await googleAI.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Generate a QA test plan and automated test scripts for the following task.\n${prompt}`,
        });
        content = geminiResponseQA.text;
        break;
      
      case "Google AI Studio":
        const geminiResponseCiCd = await googleAI.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Generate a GitHub Actions workflow file (.yml) for CI/CD related to the following task.\n${prompt}`,
        });
        content = geminiResponseCiCd.text;
        break;

      default:
        throw new functions.https.HttpsError("not-found", `AI agent ${agentName} not implemented.`);
    }
    return { content: content || "" };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.error(`Error calling ${agentName}:`, errorMessage, error);
    throw new functions.https.HttpsError("internal", `Failed to get response from ${agentName}: ${errorMessage}`);
  }
});


export const commitToGitHubProxy = functions.https.onCall(async (data, context) => {
  const { path, content, message } = data;
  try {
    let sha: string | undefined;
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
      branch: "main",
      sha,
    });
    
    return { url: response.data.commit.html_url };
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error";
    console.error(`Failed to commit to GitHub at path ${path}:`, errorMessage);
    throw new functions.https.HttpsError("internal", `GitHub commit failed: ${errorMessage}`);
  }
});
