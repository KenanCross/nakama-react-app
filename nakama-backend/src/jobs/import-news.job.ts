import { importLatestNewsArticles } from "../modules/news/news.service";
import { NewsImportJobResult } from "../modules/news/news.types";

export const importNewsJob = async (): Promise<NewsImportJobResult> => {
	const startedAtDate = new Date();

	console.log("[news-import] started", {
		startedAt: startedAtDate.toISOString(),
	});

	try {
		const result = await importLatestNewsArticles();
		const finishedAtDate = new Date();
		const jobResult: NewsImportJobResult = {
			...result,
			startedAt: startedAtDate.toISOString(),
			finishedAt: finishedAtDate.toISOString(),
			durationMs: finishedAtDate.getTime() - startedAtDate.getTime(),
			status: "completed",
		};

		console.log("[news-import] completed", {
			startedAt: jobResult.startedAt,
			finishedAt: jobResult.finishedAt,
			durationMs: jobResult.durationMs,
			fetched: jobResult.fetched,
			saved: jobResult.saved,
			imageBackfilled: jobResult.imageBackfilled,
			duplicates: jobResult.duplicates,
			rejected: jobResult.rejected,
			failedSourceCount: jobResult.failedSources.length,
		});

		return jobResult;
	} catch (error) {
		const finishedAtDate = new Date();
		const durationMs = finishedAtDate.getTime() - startedAtDate.getTime();

		console.error("[news-import] failed", {
			startedAt: startedAtDate.toISOString(),
			finishedAt: finishedAtDate.toISOString(),
			durationMs,
			message: getErrorMessage(error),
		});

		throw error;
	}
};

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}

	return "Unexpected news import failure";
};
