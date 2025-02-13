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
	return (
		<>
			{loading ? (
				<span className='loading loading-spinner loading-md'></span>
			) : (
				<div className='p-4'>
					<h4 className='uppercase mb-3 font-opensans text-xl py-2 border-b'>
						TOP 10 {type}
					</h4>{" "}
					{TopTen(data!)}
				</div>
			)}
		</>
	);
};

export default Top10;
