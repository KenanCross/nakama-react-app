import { ObjectId } from "mongodb";
import User from "./user";
import Anime from "./anime";

export default interface Review {
	reviewId?: ObjectId | String;
	// foreign key:
	userId: User["userId"];
	reviewTitle: string;
	type: "movie" | "tv" | "ona";
	date: string;
	reviewText: string;
	score: number;
	entry: {
		id: Anime["mal_id"];
		title: Anime["title"];
		imageUrl: Anime["imageURL"];
	};
}
