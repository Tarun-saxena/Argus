import axios from "axios";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL!;

export function getGithubAuthUrl(){

    const param= new URLSearchParams({
        client_id:GITHUB_CLIENT_ID,
        redirect_uri:GITHUB_CALLBACK_URL,
        scope:"read:user user:email",
        
    })

    return `https://github.com/login/oauth/authorize?${param.toString()}`;
}

export async function getToken(code: string) {
  const res = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_CALLBACK_URL,
    },
    { headers: { Accept: "application/json" } }
  );

  return res.data.access_token as string;
};

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