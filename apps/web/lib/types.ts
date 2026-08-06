export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type TriageState = "INBOX" | "BOOKMARKED" | "CLAIMED" | "IGNORED";

export interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
  skills: string[];
  preferredLanguages: string[];
  interests: string[];
  createdAt: string;
  lastMatchedAt: string | null;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  stars: number;
  primaryLanguage: string | null;
  topics: string[];
  lastPolledAt: string | null;
}

export interface Recommendation {
  id: string;
  score: number;
  state: TriageState;
  issue: {
    id: string;
    title: string;
    url: string;
    labels: string[];
    aiDifficulty: Difficulty | null;
    aiSummary: string | null;
    aiSkillsRequired: string[];
    aiEstimatedTime: string | null;
    aiRelevantFiles: string[];
    repo: Pick<Repository, "name" | "fullName" | "stars" | "primaryLanguage">;
  };
}

export interface RecommendationsResponse {
  count: number;
  recommendations: Recommendation[];
}
