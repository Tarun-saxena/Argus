import { apiBaseUrl } from "@/lib/config";
import type {
  Difficulty,
  RecommendationsResponse,
  Repository,
  TriageState,
  UserProfile,
} from "@/lib/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let errorMsg = "Request failed";
    try {
      if (text) {
        const errorObj = JSON.parse(text);
        errorMsg = errorObj.error ?? errorMsg;
      }
    } catch {
      // ignore
    }
    throw new ApiError(errorMsg, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export const api = {

  getMe: () => apiFetch<UserProfile>("/users/me"),
  updateMe: (data: Partial<Pick<UserProfile, "skills" | "preferredLanguages" | "interests">>) =>
    apiFetch<UserProfile>("/users/me", { method: "PATCH", body: JSON.stringify(data) }),
  logout: () => apiFetch<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  addRepo: (fullName: string) =>
    apiFetch<Repository>("/repos", { method: "POST", body: JSON.stringify({ fullName }) }),
  getRepos: (options?: RequestInit) => apiFetch<Repository[]>("/repos", options),
  removeRepo: (repoId: string) => apiFetch<void>(`/repos/${repoId}`, { method: "DELETE" }),
  getRecommendations: (
    params?: { difficulty?: Difficulty; issueType?: string; state?: TriageState | "ALL" },
    options?: RequestInit
  ) => {
    const query = new URLSearchParams();
    if (params?.difficulty) query.set("difficulty", params.difficulty);
    if (params?.issueType) query.set("issueType", params.issueType);
    if (params?.state) query.set("state", params.state);
    const suffix = query.size ? `?${query}` : "";
    return apiFetch<RecommendationsResponse>(`/recommendations${suffix}`, options);
  },
  exploreIssues: (
    params?: {
      cursor?: string;
      limit?: number;
      search?: string;
      skill?: string;
      difficulty?: Difficulty;
      sortBy?: "matchScore" | "difficulty" | "createdAt" | "estimatedTime" | "recent";
      sortDir?: "asc" | "desc";
      trackedOnly?: boolean;
    },
    options?: RequestInit
  ) => {
    const query = new URLSearchParams();
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.skill) query.set("skill", params.skill);
    if (params?.difficulty) query.set("difficulty", params.difficulty);
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortDir) query.set("sortDir", params.sortDir);
    if (params?.trackedOnly !== undefined) query.set("trackedOnly", params.trackedOnly.toString());
    const suffix = query.size ? `?${query}` : "";
    return apiFetch<{
      items: any[];
      nextCursor: string | null;
      hasMore: boolean;
    }>(`/issues/explore${suffix}`, options);
  },
  // Persists a triage action (bookmark / claim / ignore / inbox) to the DB.
  updateRecommendationState: (id: string, state: TriageState) =>
    apiFetch<{ id: string; state: TriageState; score: number }>(
      `/recommendations/${id}`,
      { method: "PATCH", body: JSON.stringify({ state }) },
    ),
};
