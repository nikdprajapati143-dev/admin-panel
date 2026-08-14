import crypto from "crypto";
import { CookieOptions } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

export interface DecodedToken extends TokenPayload {
    iat: number;
    exp: number;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);
};

export const verifyAccessToken = (token: string): DecodedToken => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as DecodedToken;
};

export const verifyRefreshToken = (token: string): DecodedToken => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as DecodedToken;
};

export const generateResetPasswordToken = (): {
    resetToken: string;
    hashedToken: string;
    expiresAt: Date;
} => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    return { resetToken, hashedToken, expiresAt };
};

export const hashResetToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

export const getRefreshTokenCookieOptions = (rememberMe: boolean = false): CookieOptions => {
    const maxAge = rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days if Remember Me is checked
        : 1 * 24 * 60 * 60 * 1000;  // 1 day standard session

    return {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge,
    };
};
