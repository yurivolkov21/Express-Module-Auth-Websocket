import { getDb } from "./mongo.js";

export async function ensureIndexes(): Promise<void> {
    const db = getDb();

    // User: unique index for email
    await db.collection("users").createIndex({ email: 1}, { unique: true });

    // Product: text index for search(title, description)
    await db.collection("products").createIndex({ title: "text", description: "text" }, { name: "products_text_search" });

    // RefreshToken: unique index for token
    await db.collection("refresh_tokens").createIndex({ userId: 1, revokeAt: 1, expiresAt: 1 }, { name: "refresh_tokens_user_active" });

    // Chat message: index for chatId and timestamp
    await db.collection("chat_messages").createIndex({ createdAt: -1 }, { name: "chat_timeline" });
}