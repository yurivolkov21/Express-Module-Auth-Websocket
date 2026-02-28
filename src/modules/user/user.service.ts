import type { UserDatabase } from "./user.database.js";
import type { UserDoc } from "./user.model.js";

export class UserService {
    constructor(private readonly userDb: UserDatabase) {}

    async list() {
        return await this.userDb.list();
    }

    async findById(id: string) {
        return await this.userDb.findById(id);
    }

    async updateById(id: string, data: Partial<Pick<UserDoc, 'email' | 'role'>>) {
        return await this.userDb.updateById(id, data);
    }

    async deleteById(id: string) {
        return await this.userDb.deleteById(id);
    }
}