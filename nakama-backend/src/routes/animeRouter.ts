import {  MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import express from "express";
import Anime from "../models/anime";

dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI!);
const reviewRouter = express.Router();
const errorHandler = (error: any, res: any) => {
    res.json({ message: `ERROR: ${ error }` }).status(400);
};

