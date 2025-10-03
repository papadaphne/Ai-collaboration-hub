// src/aiConfig.ts

// WARNING: STORING SECRETS IN THE FRONTEND IS A MAJOR SECURITY RISK.
// These keys will be visible to anyone using your web application.
// For production, always use a secure backend to handle API calls.

// Instructions:
// 1. Get your Google AI key from Google AI Studio.
// 2. Create a GitHub Personal Access Token with `repo` permissions.

export const GITHUB_CONFIG = {
  TOKEN: "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN", // e.g., ghp_...
  OWNER: "papadaphne", // Your GitHub username
  REPO: "ai-collab-output", // The name of the repo to commit to
};

export const API_KEYS = {
  GOOGLE: "YOUR_GOOGLE_AI_API_KEY",
};
