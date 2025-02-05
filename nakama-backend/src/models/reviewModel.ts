import { ObjectId } from "mongodb";

export default interface Review {
    // foreign Field
    reviewId?: ObjectId | string;
    // unique idetifier: localField
    userId: ObjectId | string;
    reviewBody: string;
};