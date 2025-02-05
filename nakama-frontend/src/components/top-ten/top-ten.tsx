import { useTopTen } from "../../functions/fetchAnime";
import TopTen from "./top-ten-container";

const Top10 = (type: string) => {
    let media = 0;
    let filter = 0;
    switch (type) {
			case "airing tv":
				media = 0;
				filter = 0;
				break;
			case "upcoming tv":
				media = 0;
				filter = 1;
				break;
			case "airing movie":
				media = 1;
				filter = 0;
				break;
			case "upcoming movie":
				media = 1;
				filter = 1;
				break;
		}
	const { data, loading } = useTopTen(media, filter);

    return <>{loading ? <p>Loading data...</p> : <><h4 className="uppercase mb-1">TOP 10 {type}</h4> {TopTen(data!)}</>}</>;
};

export default Top10;
