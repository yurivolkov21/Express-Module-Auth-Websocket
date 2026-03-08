import cookieParser from "cookie-parser";
import express from "express";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import { userRouters } from "./modules/user/user.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { chatRoutes } from "./modules/chat/chat.routes.js";

export function createApp() {
    const app = express();

    app.use(express.json({ limit: "1mb" }));
    app.use(cookieParser());

    app.get("/health", (_req, res) => {
        res.json({ ok: true });
    });

    app.use("/api/users", userRouters);
    app.use("/api/auth", authRoutes);
    app.use("/api/chat", chatRoutes);

    app.use(errorMiddleware);

    return app;
}
