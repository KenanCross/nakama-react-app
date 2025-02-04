import { ObjectId } from "mongodb";
import Anime from "./anime";
import Review from "./review";

interface User {
	_id?: ObjectId | String;
	userName: string;
	password: string;
	favorites: Anime[];
	reviews: Review[];
}

export default User;
