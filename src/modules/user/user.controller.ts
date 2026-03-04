import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import { ok } from "../../utils/http.js";

export class UserController {
    constructor(private readonly userService: UserService) { }

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

    bulkRegister = async (req: Request, res: Response) => {
        const inputs = req.body;
        const users = await this.userService.bulkRegister(inputs);

        res.status(201).json(
            ok(
                users.map((u) => ({
                    id: u._id.toString(),
                    email: u.email,
                    role: u.role,
                    createdAt: u.createdAt,
                }))
            )
        )
    }

    update = async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;
        const { email, role } = req.body;
        const user = await this.userService.updateUser(id, { email, role });

        res.json(
            ok({
                id: user?._id.toString(),
                email: user?.email,
                role: user?.role,
                createdAt: user?.createdAt,
            })
        );
    }

    remove = async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params;

        await this.userService.deleteUser(id);
        res.status(204).send();
    };
}