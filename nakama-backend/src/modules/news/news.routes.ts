import express from "express";
import { ingestNewsArticles, listNewsArticles } from "./news.controller";

const newsRouter = express.Router();

newsRouter.get("/news", listNewsArticles);
newsRouter.post("/news/ingest", ingestNewsArticles);

export default newsRouter;
