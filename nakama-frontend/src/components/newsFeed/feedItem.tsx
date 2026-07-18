import type { FC } from "react";
import type NewsData from "../../models/news";

interface FeedItemProps extends NewsData {
	excerptMaxLength?: number;
}

const DEFAULT_EXCERPT_MAX_LENGTH = 180;

const FeedItem: FC<FeedItemProps> = ({
	title,
	description,
	articleUrl,
	imageUrl,
	sourceName,
	publishedAt,
	excerptMaxLength = DEFAULT_EXCERPT_MAX_LENGTH,
}) => {
	const publishedDate = new Date(publishedAt).toLocaleDateString();
	const excerpt = description ? limitExcerpt(description, excerptMaxLength) : undefined;

	return (
		<article className='grid overflow-hidden border border-base-300 bg-base-100 shadow-sm'>
			<a
				className='block aspect-video w-full bg-base-200 bg-cover bg-center'
				href={articleUrl}
				target='_blank'
				rel='noopener noreferrer'
				aria-label={title}
				style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}>
				{!imageUrl && (
					<span className='flex min-h-24 w-full items-center justify-center text-2xl font-black text-base-content/70 sm:h-full'>
						{sourceName.slice(0, 2).toUpperCase()}
					</span>
				)}
			</a>
			<div className='m-auto flex w-[90%] flex-col gap-2 py-4'>
				<div className='flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-base-content/60'>
					<span>{sourceName}</span>
					<span>{publishedDate}</span>
				</div>
				<a href={articleUrl} target='_blank' rel='noopener noreferrer'>
					<h3 className='m-0 text-lg font-black leading-snug hover:underline'>{title}</h3>
				</a>
				{excerpt && <p className='m-0 line-clamp-2 text-base-content/70'>{excerpt}</p>}
				<a
					className='mt-auto font-extrabold text-primary hover:underline'
					href={articleUrl}
					target='_blank'
					rel='noopener noreferrer'>
					Read more
				</a>
			</div>
		</article>
	);
};

const limitExcerpt = (value: string, maxLength: number): string => {
	const normalized = value.replace(/\s+/g, " ").trim();

	if (normalized.length <= maxLength) {
		return normalized;
	}

	const truncated = normalized.slice(0, maxLength).replace(/\s+\S*$/, "").trim();
	return `${truncated || normalized.slice(0, maxLength).trim()}...`;
};

export default FeedItem;
