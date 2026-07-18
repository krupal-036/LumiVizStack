import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

export const signToken = (payload: any) => jwt.sign(payload, secret, { expiresIn: "30d" });

export const verifyToken = (token: string) => jwt.verify(token, secret);
