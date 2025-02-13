import { useTodaysShows } from "../../functions/fetchAnime";
import ShowCards from "../ShowCards/ShowCards";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const airingToday = () => {
	const { data, loading } = useTodaysShows();
	const [emblaRef] = useEmblaCarousel({ loop: true }, [
		Autoplay({ delay: 5000 }),
	]);

	return (
		<>
			{loading ? (
				<span className='loading loading-bars loading-lg'></span>
			) : (
				<>
					<h4 className='uppercase mb-3 font-opensans text-xl py-2 border-b'>
						SHOWS AIRING TODAY
					</h4>
					<div className='embla' ref={emblaRef}>
						<div className='embla__container'>{ShowCards(data!)}</div>
					</div>
				</>
			)}
		</>
	);
};

export default airingToday;
