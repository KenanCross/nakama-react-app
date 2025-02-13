import express from "express";
import { MongoClient } from "mongodb";
import { Review } from "../models/reviewModel";
import * as functions from "firebase-functions";

const reviewRouter = express.Router();

// Use Firebase Config for MongoDB URI
const mongoUri = functions.config().mongodb.uri || process.env.MONGODB_URI;
const client = new MongoClient(mongoUri!);
const db = client.db();

const errorHandler = (error: any, res: any) => {
    res.json({ message: `ERROR: ${error}` });
};

// Get reviews by ID
reviewRouter.get("/reviews/:id", async (req, res) => {
    try {
        const reviewsCollection = db.collection<Review>("reviews");

        const result = await reviewsCollection.find({
            "entry.id": Number(req.params.id)
        }).toArray();

        if (result.length === 0) {
            res.status(404).json({ message: "No Reviews Found" });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: `ERROR: ${error}` });
    }
});

// Get all reviews
reviewRouter.get("/allReviews", async (req, res) => {
    try {
        const reviewsCollection = db.collection<Review>("reviews");
        const result = await reviewsCollection.find({}).toArray();
        res.status(200).json(result);
    } catch (error) {
        errorHandler(error, res);
    }
});

// Create a new review
reviewRouter.post("/post", async (req, res) => {
    try {
        const reviewsCollection = db.collection<Review>("reviews");
        const newReview = req.body;
        await reviewsCollection.insertOne(newReview);
        res.json({ message: "New Review(s) Created!" });
    } catch (error) {
        errorHandler(error, res);
    }
});

export default reviewRouter;
