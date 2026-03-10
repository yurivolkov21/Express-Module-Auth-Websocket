import type { ChatService } from "./chat.service.js";
import { ok } from "../../utils/http.js";
import type { ActionController } from "../../types/express.js";

export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    // localhost:9999/api/chat/messages?limit=50&before=<time>
    listMessages: ActionController = async (req, res) => {
        const messages = await this.chatService.listHistory(req.query as any);
        res.json(ok(messages.map((m) => ({
            id: m._id.toString(),
            userEmail: m.userEmail,
            role: m.role,
            text: m.text,
            createdAt: m.createdAt,
        }))));
    };
}