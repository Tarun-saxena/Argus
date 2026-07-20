import jwt  from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload{
    userId:string
}

export function signUserToken(userId: string) {
  return jwt.sign({userId:userId}, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyUserToken(token: string) {
  return jwt.verify(token, JWT_SECRET)as JwtPayload;
}