import { MongoClient, ObjectId } from "mongodb";
import User from "../models/user";
import Review from "../models/reviewModel";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI!);
const userRouter = express.Router();
const errorHandler = (error: any, res: any) => {
    res.json({ message: `ERROR: ${error}`});
};

// joining...
userRouter.get('/users/searchReviewsByUser', async (req: any, res: any) => {
    try {
        await client.connect();
        const usersCollection = client.db().collection<User>('users');
        const reviewsCollection = client.db().collection<Review>('reviews');

        // Aggregation Pipeline:
        
        const result = await reviewsCollection.aggregate([
            {
               $lookup: {
                        from: "users",          // The primary collection we are pulling from
                        localField: "userId",   // The field in Reviews (foreign collection) that stores the reference
                        foreignField: "_id",    // The field in Users (primary collection) that we are matching
                        as: "user_info"         // The name of the new field that will store the matched User data
                }
            }
        ]).toArray();

        res.json(result).status(200);

       } catch(error) {
           errorHandler(error, res);
       } finally {
           await client.close();
       }
});


userRouter.post('/users/post', async (req: any, res: any) => {
    try {
     await client.connect();
     const usersCollection = client.db().collection<User>('users');

     const newUser = req.body;

     const result = await usersCollection.insertMany(newUser);

     res.json({ message: `New User(s) Created!` });

    } catch(error) {
        errorHandler(error, res);
    } finally {
        await client.close();
    }
});

export default userRouter;