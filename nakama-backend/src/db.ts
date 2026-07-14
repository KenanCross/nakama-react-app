import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// A single MongoClient instance shared across the entire app.
// The driver manages connection pooling internally — we connect once
// on startup and never close, which is the correct pattern for a
// long-running server process.
const client = new MongoClient(process.env.MONGODB_URI!);

export const connectDB = async () => {
	try {
		await client.connect();
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		process.exit(1); // No point running if we can't reach the DB
	}
};

// Routers import this and call it directly — no connect/close needed.
export const db = () => client.db();
