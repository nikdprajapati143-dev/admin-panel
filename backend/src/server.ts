import mongoose from "mongoose";

import app from "./app.js";
import { env } from "./config/env.js";
import connectDatabase from "./config/database.js";

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();

        const server = app.listen(env.PORT, () => {
            console.log(
                `Server running on http://localhost:${env.PORT}`,
            );
        });

        const shutdown = async (signal: string): Promise<void> => {
            console.log(`${signal} received. Shutting down server...`);

            server.close(async () => {
                console.log("HTTP server closed.");

                try {
                    await mongoose.connection.close();

                    console.log("MongoDB connection closed.");

                    process.exit(0);
                } catch (error) {
                    console.error(
                        "Error while closing MongoDB connection:",
                        error,
                    );

                    process.exit(1);
                }
            });
        };

        process.on("SIGINT", () => {
            void shutdown("SIGINT");
        });

        process.on("SIGTERM", () => {
            void shutdown("SIGTERM");
        });
    } catch (error) {
        console.error("Failed to start server:", error);

        process.exit(1);
    }
};

void startServer();