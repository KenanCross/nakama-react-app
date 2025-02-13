import { ObjectId } from "mongodb";

export default interface Anime {
    mal_id: number;
    title: string;
    imageURL: string;
    userRating?: number;
    userReview?: string;
};