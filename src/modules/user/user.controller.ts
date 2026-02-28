import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";

export class UserController {
    constructor(private readonly userService: UserService) {}

    list = async (_req: Request, res: Response) => {
        const users = await this.userService.list();
        res.json(users);
    }

    getById = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            res.status(400).json({ message: "Invalid user id" });
            return;
        }

        const user = await this.userService.findById(id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(user);
    }

    update = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            res.status(400).json({ message: "Invalid user id" });
            return;
        }

        const { email, role } = req.body;
        const found = await this.userService.updateById(id, { email, role });

        if (!found) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User updated successfully" });
    }

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            res.status(400).json({ message: "Invalid user id" });
            return;
        }

        const found = await this.userService.deleteById(id);

        if (!found) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User deleted successfully" });
    }
}