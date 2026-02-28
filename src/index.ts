import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { ensureIndexes } from "./database/index.js";
import { connectMongo } from "./database/mongo.js";

export async function bootstrap() {
    await connectMongo();

    await ensureIndexes();

    const app = createApp();

    app.listen(env.port, () => {
        console.log(`Server is running on port ${env.port}`);
    });
}

bootstrap().catch((error) => {
    console.error("Connection failed", error);
    process.exit(1);
});