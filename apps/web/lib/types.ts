export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  skills: string[];
  preferredLanguages: string[];
  interests: string[];
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
  issue: {
    id: string;
    title: string;
    url: string;
    labels: string[];
    aiDifficulty: Difficulty | null;
    aiSummary: string | null;
    aiSkillsRequired: string[];
    aiEstimatedTime: string | null;
    repo: Pick<Repository, "name" | "fullName" | "stars" | "primaryLanguage">;
  };
}

export interface RecommendationsResponse {
  count: number;
  recommendations: Recommendation[];
}
