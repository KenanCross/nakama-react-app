import User from "../models/user";
import Review from "../models/review";
import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import dotenv from "dotenv";


dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI!);
const userRouter = express.Router();
const errorHandler = (error: any, res: any) => {
    res.json({ message: `ERROR: ${ error }` }).status(400);
};

userRouter.get('/users/search', async (req: any, res: any) => {
    try {
        await client.connect();
        const userCollection = client.db().collection<User>('users');

        const query: any = {};
        const requestQuery = req.query;

        // filter:
            // by username:
            if(requestQuery.username) {
                query.userName = { $regex: new RegExp( requestQuery.username as string, 'i' )};
            }

        const result = await userCollection.find().toArray();
        res.json(result).status(200);

    } catch(error) {
        errorHandler(error, res);
    } finally {
        await client.close();
    }
});

userRouter.get('/users/findReviewsByUser', async (req: any, res: any) => {
    try {
        await client.connect();
        const userCollection = client.db().collection<User>('users');
        const reviewCollection = client.db().collection<Review>('reviews');

        // Aggregation Pipeline here:

        const resultArr = await reviewCollection.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "reviewId",
                    as: "review_details"
                }
            }
    ]).toArray();


    res.json(resultArr).status(200);

    } catch(error) {    
        errorHandler(error, res);
    } finally {
        await client.close()
    }
});

userRouter.post('/users');

userRouter.put('/users');

userRouter.delete('/users');

export default userRouter;