import userRouter from "./routes/userRouter";
import reviewRouter from "./routes/reviewRouter";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
	origin: `http://localhost:5173`,
	methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use('/api', [userRouter, reviewRouter]);

// Connect to MongoDB once, then start listening.
// If the DB connection fails, connectDB() calls process.exit(1)
// so we never serve requests against a broken connection.
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
});
