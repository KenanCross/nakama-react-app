import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter";
import reviewRouter from "./routes/reviewRouter";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
}));

app.use(express.json());
app.use("/api", userRouter);
app.use("/api", reviewRouter);

export default app;
