import Anime from "./anime";
import Review from "./review";

interface User {
	_id?: string;
	userName: string;
	password: string;
	favorites: Anime[];
	reviews: Review[];
}

export default User;
