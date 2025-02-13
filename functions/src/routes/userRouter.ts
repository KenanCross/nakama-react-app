import express from "express";
import { MongoClient } from "mongodb";
import User from "../models/user";
import * as functions from "firebase-functions";

const userRouter = express.Router();

// Use Firebase Config for MongoDB URI
const mongoUri = functions.config().mongodb.uri || process.env.MONGODB_URI;
const client = new MongoClient(mongoUri!);
const db = client.db();

const errorHandler = (error: any, res: any) => {
    res.json({ message: `ERROR: ${error}` });
};

// Get all Users
userRouter.get("/allUsers", async (req, res) => {
    try {
        const usersCollection = db.collection<User>("users");
        const result = await usersCollection.find({}).toArray();
        res.status(200).json(result);
    } catch (error) {
        errorHandler(error, res);
    }
});

// Search by query
userRouter.get("/search", async (req, res) => {
    try {
        const usersCollection = db.collection<User>("users");
        const query = {};
        const result = await usersCollection.find(query).toArray();
        res.status(200).json(result);
    } catch (error) {
        errorHandler(error, res);
    }
});

// Join users with reviews
userRouter.get("/searchReviewsByUser", async (req, res) => {
    try {
        const usersCollection = db.collection<User>("users");
        const reviewsCollection = db.collection("reviews");

        const result = await reviewsCollection
            .aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "reviewId",
                        foreignField: "userId",
                        as: "user_info",
                    },
                },
                { $unwind: "$user_info" },
            ])
            .toArray();

        res.status(200).json(result);
    } catch (error) {
        errorHandler(error, res);
    }
});

// Create a new user
userRouter.post("/post", async (req, res) => {
    try {
        const usersCollection = db.collection<User>("users");
        const newUser = req.body;
        await usersCollection.insertMany(newUser);
        res.json({ message: "New User(s) Created!" });
    } catch (error) {
        errorHandler(error, res);
    }
});

export default userRouter;
