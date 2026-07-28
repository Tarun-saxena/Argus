import { apiBaseUrl } from "@/lib/config";
import type {
  Difficulty,
  RecommendationsResponse,
  Repository,
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
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new ApiError(error.error ?? "Request failed", response.status);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getMe: () => apiFetch<UserProfile>("/users/me"),
  updateMe: (data: Partial<Pick<UserProfile, "skills" | "preferredLanguages" | "interests">>) =>
    apiFetch<UserProfile>("/users/me", { method: "PATCH", body: JSON.stringify(data) }),
  logout: () => apiFetch<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  addRepo: (fullName: string) =>
    apiFetch<Repository>("/repos", { method: "POST", body: JSON.stringify({ fullName }) }),
  getRepos: () => apiFetch<Repository[]>("/repos"),
  getRecommendations: (params?: { difficulty?: Difficulty; issueType?: string }) => {
    const query = new URLSearchParams();
    if (params?.difficulty) query.set("difficulty", params.difficulty);
    if (params?.issueType) query.set("issueType", params.issueType);
    const suffix = query.size ? `?${query}` : "";
    return apiFetch<RecommendationsResponse>(`/recommendations${suffix}`);
  },
};
