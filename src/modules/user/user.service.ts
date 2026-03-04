import { hash } from "node:crypto";
import { ApiError } from "../../utils/http.js";
import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserDoc, UserRole } from "./user.model.js";
import { hashPassword } from "../../utils/crypto.js";

export class UserService {
    constructor(private readonly userDb: UserDatabase) { }

    async list() {
        return await this.userDb.list();
    }

    async register(input: { email: string; password: string; role?: UserRole }): Promise<UserEntity> {
        const email = input.email.trim().toLocaleLowerCase();
        if (!email.includes('@')) throw new ApiError(400, { message: `Invalid email address: ${email}` });

        const password = input.password;
        if (input.password.length < 6) throw new ApiError(400, { message: `Password too short for: ${email}` });

        const existed = await this.userDb.findByEmail(email);
        if (existed) throw new ApiError(400, { message: "Email already exists" });

        const now = new Date();
        const hashedPassword = await hashPassword(password);
        const role: UserRole = input.role || "customer";

        return this.userDb.create({
            email,
            passwordHash: hashedPassword,
            role,
            createdAt: now,
            updatedAt: now
        });
    }

    async bulkRegister(inputs: Array<{ email: string; password: string; role?: UserRole }>): Promise<UserEntity[]> {
        const now = new Date();
        const docs: UserDoc[] = [];

        for (const input of inputs) {
            const email = input.email.trim().toLocaleLowerCase();

            if (!email.includes('@')) throw new ApiError(400, { message: `Invalid email address: ${email}` });
            if (input.password.length < 6) throw new ApiError(400, { message: `Password too short for: ${email}` });

            const existed = await this.userDb.findByEmail(email);
            if (existed) throw new ApiError(400, { message: `Email already exists: ${email}` });

            const passwordHash = await hashPassword(input.password);

            docs.push({
                email,
                passwordHash,
                role: input.role ?? "customer",
                createdAt: now,
                updatedAt: now
            });
        }

        return this.userDb.createMany(docs);
    }

    async updateUser(
        id: string,
        input: { email?: string, role?: UserRole }
    ): Promise<UserEntity> {
        const existed = await this.userDb.findById(id);
        if (!existed) throw new ApiError(404, { message: "User not found" });

        const update: Partial<Pick<UserDoc, "email" | "role">> = {};

        if (input.email) {
            const email = input.email.trim().toLocaleLowerCase();
            if (!email.includes('@')) throw new ApiError(400, { message: `Invalid email address: ${email}` });
            update.email = email;
        }

        if (input.role) {
            update.role = input.role;
        }

        const updated = await this.userDb.updateById(id, update);
        if (!updated) throw new ApiError(500, { message: "Failed to update user" });

        return updated;
    }

    async deleteUser(id: string): Promise<void> {
        const existed = await this.userDb.findById(id);
        if (!existed) throw new ApiError(404, { message: "User not found" });

        const deleted = await this.userDb.deleteById(id);
        if (!deleted) throw new ApiError(500, { message: "Delete failed" });
    }
}