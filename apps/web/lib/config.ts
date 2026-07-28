export const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

export const githubAuthUrl = `${apiBaseUrl}/auth/github`;
