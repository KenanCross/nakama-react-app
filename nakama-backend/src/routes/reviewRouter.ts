import {  MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import express from "express";
import Review from "../models/review";

dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI!);
const reviewRouter = express.Router();
const errorHandler = (error: any, res: any) => {
    res.json({ message: `ERROR: ${ error }` }).status(400);
};

// export const loadCollection = async (client: MongoClient, collectionName: string) => {
//     //access the MongoDB Collection and load specified collection name
//     if (collectionName === 'product') {
//         return client.db().collection<Product>(collectionName);
//     } else {
//         return client.db().collection<User>(collectionName);
//     }
    
// };

// loading the collection:


// Routes here:

// GET - retrieve Reviews
reviewRouter.get('/reviews/search', async (req: any, res: any) => {
    try {
        await client.connect();

        const reviewCollection = client.db().collection<Review>('reviews');

        const query: any = {};

        // filters:
        if(req.query.type) { 
            const type = req.query.type

            if(type === "movie" || type === "tv" || type === "ona") {
                query.type = { $regex: new RegExp(req.query.type as string, 'i') }
            }
        };

        if(req.query.score) {
            query.score = parseInt(req.query.score);
        };

        // TODO: filter by date, anime.title

        const resultArr = await reviewCollection.find( query ).toArray();

        res.json(resultArr).status(200);

    } catch(error) {
        errorHandler(error, res);
    } finally {
        await client.close();
    }
});

// JOIN
reviewRouter.get('/reviews/join', async (req: any, res: any) => {
    try {
        await client.connect();

        

    } catch(error) {
        errorHandler(error, res);
    } finally {
        await client.close();
    }
});

// Post:
reviewRouter.post('/reviews/post', async (req: any, res: any) => {
        try {

        } catch(error) {

        } finally {
            
        }
})

// Put:
reviewRouter.put('/reviews/update');

// Delete:
reviewRouter.delete('/reviews/delete');

export default reviewRouter;

/*
GET - retrieve User
GET - retrieve Favorites

POST - add User
POST - add Favorite
POST - add Review
PUT - update Favorite
PUT - update User
PUT - update Review
DELETE - remove Favorite
DELETE - remove Review
*/
