import { useState, type FC } from "react";
import { useGetNews } from "../../functions/fetchBackend";
import FeedItem from "./feedItem";

const categories = [
	{ label: "All", value: undefined },
	{ label: "Anime", value: "anime" },
	{ label: "Gaming", value: "gaming" },
];

const NewsFeed: FC = () => {
	const [activeCategory, setActiveCategory] = useState<string | undefined>();
	const { news, nextCursor, loading, loadingMore, error, loadMore } = useGetNews({
		category: activeCategory,
		limit: 20,
	});

	return (
		<section className='my-8' aria-labelledby='news-feed-heading'>
			<div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<p className='m-0 text-xs font-bold uppercase text-base-content/60'>Latest stories</p>
					<h2 id='news-feed-heading' className='m-0 text-3xl font-black'>
						News Feed
					</h2>
				</div>
				<div className='tabs-boxed tabs overflow-x-auto' aria-label='News categories'>
					{categories.map((category) => (
						<button
							key={category.label}
							type='button'
							className={`tab font-bold ${
								activeCategory === category.value ? "tab-active" : ""
							}`}
							onClick={() => setActiveCategory(category.value)}>
							{category.label}
						</button>
					))}
				</div>
			</div>

			{error && <p className='my-4 text-base-content/70'>{error}</p>}

			{loading ? (
				<div className='flex justify-center py-4' aria-label='Loading news'>
					<span className='loading loading-bars loading-lg'></span>
				</div>
			) : news.length === 0 ? (
				<p className='my-4 text-base-content/70'>No news articles found.</p>
			) : (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{news.map((item) => (
						<FeedItem key={item.id} {...item} excerptMaxLength={180} />
					))}
				</div>
			)}

			{nextCursor && !loading && (
				<div className='flex justify-center py-4'>
					<button
						type='button'
						className='btn btn-neutral'
						onClick={loadMore}
						disabled={loadingMore}>
						{loadingMore ? "Loading..." : "Load more"}
					</button>
				</div>
			)}
		</section>
	);
};

export default NewsFeed;
