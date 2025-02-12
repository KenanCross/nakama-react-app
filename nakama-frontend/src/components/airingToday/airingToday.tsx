import { useTodaysShows } from "../../functions/fetchAnime"
import ShowCards from "../ShowCards/ShowCards"

const airingToday = () => {
    

    const { data, loading } = useTodaysShows();

    return (
			<>
				{loading ? (
					<span className='loading loading-bars loading-lg'></span>
				) : (
                    ShowCards(data!)
                    
				)}
			</>
		);
}

export default airingToday