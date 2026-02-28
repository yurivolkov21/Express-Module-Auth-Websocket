import cookieParser from "cookie-parser";
import express from "express";
import { userRoutes } from "./modules/user/user.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export function createApp() {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use("/api/user", userRoutes);

    app.use(errorMiddleware);

    return app;
}