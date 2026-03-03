import type { Request, Response } from "express";
import type { AuthService } from "./auth.service.js";
import { ok } from "../../utils/http.js";
import { env } from "../../config/env.js";

function setCookie(res: Response, token: string) {
    res.cookie(env.refreshCookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: env.nodeEnv === "production",
        maxAge: env.accessTokenTtlSeconds * 1000,
        path: "/api/auth",
    });
}

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    login = async (_req: Request, res: Response) => {
        const { email, password } = _req.body ?? {};
        // const userAgent = _req.headers["user-agent"];
        // const userIp = _req.ip;
        const input = {
            email,
            password,
        };
        const { accessToken, refreshToken } = await this.authService.login(input);

        setCookie(res, accessToken);
        res.json(ok({ accessToken, refreshToken }));
    };
}