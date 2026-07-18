import { FC } from "react";
import { useGetNews } from "../../functions/fetchBackend";
import FeedItem from "./feedItem";

const NewsFeed: FC = () => {
	const news = useGetNews();

	return (
		<>
			{news.map((item) => (
				<FeedItem key={item.id} {...item} />
			))}
		</>
	);
};

export default NewsFeed;
