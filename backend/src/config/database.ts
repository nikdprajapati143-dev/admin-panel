import mongoose from "mongoose";

const connectDatabase = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    try {
        await mongoose.connect(mongoUri);

        console.log("MongoDB connected successfully");
        console.log(`MongoDB host: ${mongoose.connection.host}`);
        console.log(`MongoDB database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error);

        process.exit(1);
    }

    mongoose.connection.on("error", (error) => {
        console.error("MongoDB runtime error:", error);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
        console.log("MongoDB reconnected");
    });
};

export default connectDatabase;