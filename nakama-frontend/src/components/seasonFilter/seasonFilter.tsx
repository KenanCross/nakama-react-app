import { useState} from "react";
import itemsList from "../itemList/itemsList";
import { useFilteredData } from "../../functions/fetchAnime";

const seasonFilter = () => {
	const [seasonFilter, setSeasonFilter] = useState(0); //Add Filtering Functionality to itemList/itemFilter component.
	const [page, setPage] = useState(1);
	const [continueFlag, setContinueFlag] = useState(false);
	const [isChecked, setChecked] = useState(false)
	const [isDisabled, setIsDisabled] = useState(false);
	const { data, loading, lastPage } = useFilteredData(
		seasonFilter,
		continueFlag,
		page
	);
	
	const handleSeasonClick = (filter: number) => {
		setSeasonFilter(filter);
		setPage(1);
		if (filter === 0) {
			setContinueFlag(true)
			setChecked(true)
			setIsDisabled(false)
		} else {
			setIsDisabled(true)
		}
	};

	const handleContinue = () => {
		setContinueFlag(!continueFlag)
		setChecked(!isChecked);
	}

	return (
		<div className='mb-6 p-2 flex flex-col gap-3 max-w-[90rem] min-h-96'>
			<div className='mb-3 flex flex-col xl:flex-row justify-evenly align-middle'>
				<h4 className='basis-1/2 xl:basis-1/3 mb-5 xl:my-auto uppercase font-opensans text-xl'>
					Airing This Season
				</h4>
				<div className='flex basis-1/2 xl:basis-1/3 xl:justify-between'>
					<button
						className='btn btn-ghost basis-1/4'
						onClick={() => handleSeasonClick(0)}>
						TV
					</button>
					<button
						className='btn btn-ghost basis-1/4'
						onClick={() => handleSeasonClick(2)}>
						ONA
					</button>
					<button
						className='btn btn-ghost basis-1/4'
						onClick={() => handleSeasonClick(1)}>
						MOVIE
					</button>
					<div className='form-control basis-1/4'>
						<label className='label cursor-pointer'>
							<span className='label-text'>Continuing?</span>
							<input
								type='checkbox'
								checked={isChecked}
								className='toggle toggle-secondary'
								disabled={isDisabled}
								onChange={handleContinue}
							/>
						</label>
					</div>
				</div>
				<div className='hidden xl:flex xl:basis-1/3 justify-end'>
					<div className='flex-1/6'>
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
			</div>
			<div className='flex flex-row gap-2 md:gap-3 h-auto min-h-[1556px] justify-center flex-wrap'>
				{loading ? (
					<span className='loading loading-bars loading-lg'></span>
				) : (
					itemsList(data!)
				)}
			</div>
			<div className='my-5 join justify-center xl:hidden '>
				<button
					className='join-item btn'
					onClick={() => setPage(page - 1)}
					disabled={page === 1}>
					«
				</button>
				<button className='join-item btn'>Page {page}</button>
				<button
					className='join-item btn'
					onClick={() => setPage(page + 1)}
					disabled={lastPage === false}>
					»
				</button>
			</div>
		</div>
	);
};

export default seasonFilter;
