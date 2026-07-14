// Global request queue for Jikan API calls.
// All hooks funnel through here so we never exceed Jikan's
// 3 req/sec rate limit, regardless of how many components mount at once.
// Requests are processed one at a time with a 400ms gap between each —
// well within the limit, and forgiving enough to avoid 429s under normal use.

const QUEUE_INTERVAL_MS = 400;

type QueuedRequest = () => Promise<void>;

const queue: QueuedRequest[] = [];
let isProcessing = false;

const processQueue = async () => {
	if (isProcessing || queue.length === 0) return;
	isProcessing = true;

	while (queue.length > 0) {
		const next = queue.shift()!;
		await next();
		if (queue.length > 0) {
			// Pause between requests to stay within rate limits
			await new Promise((resolve) => setTimeout(resolve, QUEUE_INTERVAL_MS));
		}
	}

	isProcessing = false;
};

// Wraps a fetch function in a Promise and pushes it onto the queue.
// Returns a promise that resolves/rejects when the request eventually runs.
export const enqueue = <T>(fetchFn: () => Promise<T>): Promise<T> => {
	return new Promise<T>((resolve, reject) => {
		queue.push(async () => {
			try {
				const result = await fetchFn();
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
		processQueue();
	});
};
