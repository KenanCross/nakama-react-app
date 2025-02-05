import { ObjectId } from "mongodb";
import User from "./user";
import {Anime} from "./anime";
interface Review {
	_id?: ObjectId | String;
	userId: User["_id"];
	type: "movie" | "tv" | "ona";
	data: string;
	review: string;
	score: number;
	entry: {
		id: Anime["mal_id"];
		title: Anime["title"];
		imageUrl: Anime["imageURL"];
	};
}

export default Review
