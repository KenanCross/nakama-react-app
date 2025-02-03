import { ObjectId } from "mongodb";
import Anime from "./animeModel";

export default interface User {
    _id?: ObjectId | string; 
    userName: string;
    password: string;
    favorites?: Anime[];
};