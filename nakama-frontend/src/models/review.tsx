import Anime from "./anime";

export default interface Review {
	_id?: string;
	type: "movie" | "tv" | "ona";
	data: string;
	review: string;
	score: number;
	entry: {
		id: Anime["mal_id"];
		title: Anime["title"];
		imageUrl: string;
	};
};
