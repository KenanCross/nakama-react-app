import { useTodaysShows } from "../../functions/fetchAnime";
import ShowCards from "../ShowCards/ShowCards";
import ErrorMessage from "../ErrorMessage";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const AiringToday = () => {
	const { data, loading, error, refetch } = useTodaysShows();
	const [emblaRef] = useEmblaCarousel({ loop: true }, [
		Autoplay({ delay: 5000 }),
	]);

	if (error) return <ErrorMessage message={error} onRetry={refetch} />;

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
						<div className='embla__container'>
							{/* ShowCards rendered as JSX, not called as a function */}
							<ShowCards data={data!.data} index={0} />
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default AiringToday;
