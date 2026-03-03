import type { ObjectId } from "mongodb";

export type RefreshTokenDoc = {
    userId: ObjectId;
    tokenId: string;
    issueAt: Date;
    expiresAt: Date;
    revokeAt?: Date;
    replacedByTokenId?: string;
    userAgent?: string;
    ip?: string;
}