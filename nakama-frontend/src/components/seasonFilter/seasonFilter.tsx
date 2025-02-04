import { useState} from "react";
import itemsList from "../itemList/itemsList";
import { useFilteredData } from "../../functions/fetchAnime";

const seasonFilter = () => {
	const [seasonFilter, setSeasonFilter] = useState(0); //Add Filtering Functionality to itemList/itemFilter component.
	const [page, setPage] = useState(1);
	const [continueFlag, setContinueFlag] = useState(false);
	const { data, loading, lastPage } = useFilteredData(
		seasonFilter,
		continueFlag,
		page
	);

	const handleSeasonClick = (filter: number) => {
		setSeasonFilter(filter);
		setPage(1);
	};

	const handleContinue = () => {
		setContinueFlag(!continueFlag)
	}

	return (
		<div className='mb-6'>
			<div className='mb-3 flex justify-between'>
				<h4 className='flex-1/4'>Anime Airing This Season</h4>
				<div className='flex flex-2/4 justify-between'>
					<button
						className='btn btn-ghost flex-1/4'
						onClick={() => handleSeasonClick(0)}>
						TV
					</button>
					<button
						className='btn btn-ghost flex-1/4'
						onClick={() => handleSeasonClick(2)}>
						ONA
					</button>
					<button
						className='btn btn-ghost flex-1/4'
						onClick={() => handleSeasonClick(1)}>
						MOVIE
					</button>
					<div className='form-control flex-1/4'>
						<label className='label cursor-pointer'>
							<span className='label-text'>Continuing?</span>
							<input
								type='checkbox'
								className='toggle toggle-secondary'
								onChange={handleContinue}
								
							/>
						</label>
					</div>
				</div>
				<div className='flex-1/4'>
					<div className='join grid grid-cols-2'>
						<button
							className='join-item btn btn-outline'
							onClick={() => setPage(page - 1)}
							disabled={page === 1}>
							Previous page
						</button>
						<button
							className='join-item btn btn-outline'
							onClick={() => setPage(page + 1)}
							disabled={lastPage === false}>
							Next
						</button>
					</div>
				</div>
			</div>

			{loading ? <p>Loading Data...</p> : itemsList(data!)}
		</div>
	);
};

export default seasonFilter;
