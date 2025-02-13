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


//get all Users:
userRouter.get('/users/allUsers', async (req: any, res: any) => {
    try {
        await client.connect();
        const usersCollection = client.db().collection<User>('users');

        const result = await usersCollection.find({}).toArray();

        res.json(result).status(200);
        
       } catch(error) {
           errorHandler(error, res);
       } finally {
           await client.close();
       }
});

// Search by query:
userRouter.get('/users/search', async (req: any, res: any) => {
    try {
        await client.connect();
        const usersCollection = client.db().collection<User>('users');

        const query: any = {};

        const result = await usersCollection.find( query ).toArray();

        res.json(result).status(200);
        
       } catch(error) {
           errorHandler(error, res);
       } finally {
           await client.close();
       }
});

// joining...
userRouter.get('/users/searchReviewsByUser', async (req: any, res: any) => {
    try {
        await client.connect();
        const usersCollection = client.db().collection<User>('users');
        const reviewsCollection = client.db().collection<Review>('reviews');

        const result = await reviewsCollection.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "reviewId",
                    foreignField: "userId",
                    as: "user_info"
                }
            },
            {
                $unwind: "$user_info"
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