import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import { ok } from "../../utils/http.js";

export class UserController {
    constructor(private readonly userService: UserService) {}

    list = async (_req: Request, res: Response) => {
        const users = await this.userService.list();
        res.json({ data: users });
    }

    register = async (_req: Request, res: Response) => {
        const { email, password, role } = _req.body;

        const user = await this.userService.register({ email, password, role });

        res.status(201).json(
            ok({
                id: user?._id.toString(),
                email: user?.email,
                role: user?.role,
                createdAt: user?.createdAt,
                updatedAt: user?.updatedAt
            })
        )
    }
}