import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";

export class UserController {
    constructor(private readonly userService: UserService) {}

    list = async (_req: Request, res: Response) => {
        const users = await this.userService.list();
        res.json(users);
    }
}