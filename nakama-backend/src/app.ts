import userRouter from "./routes/userRouter";
import reviewRouter from "./routes/reviewRouter";
import newsRouter from "./modules/news/news.routes";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db";
import { ensureNewsIndexes } from "./modules/news/news.repository";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
	origin: `http://localhost:5173`,
	methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use('/api', [userRouter, reviewRouter, newsRouter]);

// Connect to MongoDB once, then start listening.
// If the DB connection fails, connectDB() calls process.exit(1)
// so we never serve requests against a broken connection.
connectDB()
	.then(async () => {
		await ensureNewsIndexes();
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to start server:", error);
		process.exit(1);
	});
