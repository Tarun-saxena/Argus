import { Router } from "express";
import { prisma } from "@repo/db";
import { getGithubAuthUrl, getToken, fetchGithubUser } from "./github.js";
import { signUserToken } from "./jwt.js";

const router = Router();

router.get("/github", (req, res) => {

  res.redirect(getGithubAuthUrl());
});

router.get("/github/callback", async (req, res) => {
  const { code } = req.query;

  if (!code ) {
    return res.status(400).send("Invalid OAuth state");
  }

  try {
    const accessToken = await getToken(code as string);
    const ghUser = await fetchGithubUser(accessToken);

    const user = await prisma.user.upsert({
      where: { githubId: ghUser.githubId },
      update: { username: ghUser.username, email: ghUser.email },
      create: {
        githubId: ghUser.githubId,
        username: ghUser.username,
        email: ghUser.email,
        skill: [],
        preferredLanguages: [],
        interests: [],
      },
    });

    const token = signUserToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure:false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(process.env.FRONTEND_URL!);
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth failed");
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

export default router;