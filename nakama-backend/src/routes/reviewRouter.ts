import { MongoClient, ObjectId } from "mongodb";
import Review from "../models/reviewModel";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI!);
const reviewRouter = express.Router();
const errorHandler = (error: any, res: any) => {
    res.json({ message: `ERROR: ${error}`});
};


reviewRouter.get('/reviews/allReviews', async (req: any, res: any) => {
    try {
        await client.connect(); 
        const reviewsCollection = client.db().collection<Review>('reviews');

        const result = await reviewsCollection.find({}).toArray();

        res.json(result).status(200);

    } catch(error) {
        errorHandler(error, res);
    } finally {
        await client.close();
    }
});

// Get search by query:

reviewRouter.post('/reviews/post', async (req: any, res: any) => {
    try {
     await client.connect();
     const usersCollection = client.db().collection<Review>('reviews');

     const newReview = req.body;

     const result = await usersCollection.insertMany([...newReview]);


     res.json({ message: `New Review(s) Created!` });

    } catch(error) {
        errorHandler(error, res);
    } finally {
        await client.close();
    }
});

// Put:

// Delete:

export default reviewRouter;