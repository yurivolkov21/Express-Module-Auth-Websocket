import type { UserDatabase } from "./user.database.js";

export class UserService {
    constructor(private readonly userDb: UserDatabase) {}

    async list() {
        return await this.userDb.list();
    }
}