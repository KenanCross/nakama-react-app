import { ObjectId } from "mongodb";
import User from "./user";

export interface Review {
	_id?: ObjectId | string;
	userId: User["_id"];
	type: string;
	data: string;
	review: string;
	score: number;
	entry: {
		id: number;
		title: string;
		imageUrl: string;
	};
}
