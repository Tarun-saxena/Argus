import "dotenv/config";
import axios from "axios";

function getGithubConfig() {
  return {
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    callbackUrl: process.env.GITHUB_CALLBACK_URL ?? "",
  };
}

export function getGithubAuthUrl() {
  const { clientId, callbackUrl } = getGithubConfig();
  const param = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: "read:user user:email",
  });

  return `https://github.com/login/oauth/authorize?${param.toString()}`;
}

export async function getToken(code: string) {
  const { clientId, clientSecret, callbackUrl } = getGithubConfig();
  const res = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: callbackUrl,
    },
    { headers: { Accept: "application/json" } }
  );

  return res.data.access_token as string;
}

export async function fetchGithubUser(accessToken: string) {
    
  const [userResponse, emailsResponse] = await Promise.all([
    axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  const primaryEmail = emailsResponse.data.find((e: any) => e.primary)?.email ?? null;

  return {
    githubId: String(userResponse.data.id),
    username: userResponse.data.login,
    email: primaryEmail,
  };
}