import type { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { UserDoc } from "./user.model.js";

export class UserDatabase {
    private col() {
        return getDb().collection<UserDoc>("users");
    }

    async list(): Promise<Array<UserDoc & { _id: ObjectId }>> {
        return await this.col().find({}).limit(50).toArray();
    }
}