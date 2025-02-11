import userRouter from "./routes/userRouter";
import reviewRouter from "./routes/reviewRouter";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: `http://localhost:5173`,
    methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use('/api', userRouter, reviewRouter);

app.listen(PORT, () => {
    console.log(`server's running on http://localhost:${PORT}`);
});
