import { verifyPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import type { UserDatabase } from "../user/user.database.js";
import type { AuthDatabase } from "./auth.database.js";
import crypto from "crypto";
import type { RefreshTokenDoc } from "./auth.model.js";
import { env } from "../../config/env.js";

function randomTokenId(): string {
    return crypto.randomUUID();
}

export class AuthService {
    constructor(
        private readonly authDb: AuthDatabase,
        private readonly userDb: UserDatabase,
    ) { }

    async login(input: {
        email: string;
        password: string;
        userAgent?: string;
        ip?: string;
    }) {
        const email = input.email.trim().toLowerCase();
        const user = await this.userDb.findByEmail(email);
        if (!user) throw new ApiError(404, { message: "Email not found" });

        const ok = await verifyPassword(input.password, user.passwordHash);

        if (!ok)
            throw new ApiError(401, {
                message: "Password is not correct",
            });

        const accessToken = signAccessToken({
            sub: user._id.toString(),
            role: user.role,
        });

        const tokenId = randomTokenId();
        const now = new Date();
        const expiresAt = new Date(
            now.getTime() + env.refreshTokenTtlSeconds * 1000,
        );

        const doc: RefreshTokenDoc = {
            userId: user._id,
            tokenId,
            issueAt: now,
            expiresAt,
        };

        const refreshToken = signRefreshToken({
            sub: user._id.toString(),
            jti: tokenId,
        });

        await this.authDb.insert(doc);
        return { accessToken, refreshToken };
    }

    async refresh() { }
    async logout() { }
}