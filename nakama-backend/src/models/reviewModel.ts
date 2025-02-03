import { ObjectId } from "mongodb";

export default interface Review {
    //          
    _id?: ObjectId | string;
    //  // localField 
    userId: ObjectId | string;
    reviewBody: string;
};