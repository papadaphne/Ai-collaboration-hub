// src/aiConfig.ts

// WARNING: This file contains sensitive information.
// DO NOT commit this file to version control. Add it to your .gitignore file.

export const GITHUB_CONFIG = {
  TOKEN: "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", // Must have 'repo' scope
  OWNER: "papadaphne",
  REPO: "ai-collab-output", // e.g., "ai-collab-output"
};

export const API_KEYS = {
  OPENAI: "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",
  DEEPSEEK: "sk-90e903e84e5a4358ab5f1bb1d8eee54a",
  // NOTE: The application is configured to use the Google AI key from a secure
  // environment variable (process.env.API_KEY) for enhanced security.
  // This value is stored here for reference or for non-Gemini Google services.
  GOOGLE: "AIzaSyD6gJYBsBtFy6atUXeHAcwQ_tr6GAs5X-U",
};