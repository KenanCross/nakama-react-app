import crypto from "node:crypto";

export const createArticleFingerprint = (title: string, sourceName: string): string => {
	const normalized = `${sourceName}:${title}`
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, " ")
		.trim();

	return crypto.createHash("sha256").update(normalized).digest("hex");
};
