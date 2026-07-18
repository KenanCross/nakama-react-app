import { FC } from "react";
import NewsData from "../../models/news";
import "./style/feedItem.css";

const FeedItem: FC<NewsData> = ({
	title,
	description,
	articleUrl,
	imageUrl,
	sourceName,
	publishedAt,
}) => {
	const publishedDate = new Date(publishedAt).toLocaleDateString();

	return (
		<>
			<div className='flex flex-row'>
				<div>
					<a href={articleUrl} target='_blank' rel='noopener noreferrer'>
						{imageUrl && <img src={imageUrl} alt={title} />}
					</a>
				</div>
				<div className='flex-col'>
					<a href={articleUrl} target='_blank' rel='noopener noreferrer'>
						<h3>{title}</h3>
					</a>
					<p>{description}</p>
					<p>{publishedDate}</p>
					<a href={articleUrl} target='_blank' rel='noopener noreferrer'>
						Read more at {sourceName}
					</a>
				</div>
			</div>
		</>
	);
};

export default FeedItem;
