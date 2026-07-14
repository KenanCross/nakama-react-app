import { useContinuingShows } from "../../functions/fetchAnime";
import ShowCards from "../ShowCards/ShowCards";
import ErrorMessage from "../ErrorMessage";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";

interface ContinuingTodayProps {
	onLoaded?: () => void;
}

const ContinuingToday = ({ onLoaded }: ContinuingTodayProps) => {
	const { data, loading, error, refetch } = useContinuingShows();
	const [emblaRef] = useEmblaCarousel({ loop: true }, [
		Autoplay({ delay: 5000 }),
	]);

	useEffect(() => {
		if (!loading && onLoaded) {
			onLoaded();
		}
	}, [loading]);

	if (error) return <ErrorMessage message={error} onRetry={refetch} />;

	return (
		<>
			{loading ? (
				<span className='loading loading-bars loading-lg'></span>
			) : (
				<>
					<h4 className='uppercase mb-3 font-opensans text-xl py-2 border-b'>
						CONTINUING SHOWS
					</h4>
					<div className='embla' ref={emblaRef}>
						<div className='embla__container'>
							<ShowCards data={data!.data} index={0} />
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default ContinuingToday;
