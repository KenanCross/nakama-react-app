import { Request, Response } from "express";
import { importNewsJob } from "../../jobs/import-news.job";
import { getNewsArticles } from "./news.service";

export const ingestNewsArticles = async (_req: Request, res: Response) => {
	try {
		const result = await importNewsJob();
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: getErrorMessage(error) });
	}
};

export const listNewsArticles = async (req: Request, res: Response) => {
	try {
		const category = readOptionalString(req.query.category);
		const cursor = readOptionalString(req.query.cursor);
		const limit = readOptionalNumber(req.query.limit);
		const result = await getNewsArticles({ category, cursor, limit });

		res.status(200).json(result);
	} catch (error) {
		const message = getErrorMessage(error);
		const status = message === "Invalid news cursor" ? 400 : 500;
		res.status(status).json({ message });
	}
};

const readOptionalString = (value: unknown): string | undefined =>
	typeof value === "string" && value.trim() ? value.trim() : undefined;

const readOptionalNumber = (value: unknown): number | undefined => {
	if (typeof value !== "string" || !value.trim()) {
		return undefined;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
};

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}

	return "Unexpected news feed error";
};
