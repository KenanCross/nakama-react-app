import { ObjectId } from "mongodb";
import Anime from "./anime";
import Review from "./review";

interface User {
	userId?: ObjectId | String;
	userName: string;
	password: string;
	favorites: Anime["mal_id"][];
	reviews: Review["reviewId"][];
}

export default User;
