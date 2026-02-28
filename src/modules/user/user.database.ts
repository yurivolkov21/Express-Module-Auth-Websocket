import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { UserDoc } from "./user.model.js";


export class UserDatabase {
    private col() {
        return getDb().collection<UserDoc>("users");
    }

    async list(): Promise<Array<UserDoc & { _id: ObjectId }>> {
        return await this.col().find({}).limit(50).toArray();
    }

    async findById(id: string): Promise<UserDoc & { _id: ObjectId } | null> {
        return await this.col().findOne({ _id: new ObjectId(id) });
    }

    async updateById(id: string, data: Partial<Pick<UserDoc, 'email' | 'role'>>): Promise<boolean> {
        const result = await this.col().updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...data, updatedAt: new Date() } }
        )

        return result.matchedCount === 1;
    }
}