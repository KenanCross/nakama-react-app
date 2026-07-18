const REQUEST_TIMEOUT_MS = 5000;

export const fetchArticleImageUrl = async (articleUrl: string): Promise<string | undefined> => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(articleUrl, {
			headers: {
				"User-Agent": "Nakama/1.0 Article Metadata Importer",
				Accept: "text/html,application/xhtml+xml",
			},
			signal: controller.signal,
		});

		if (!response.ok) {
			return undefined;
		}

		const html = await response.text();
		const imageUrl = readMetaImage(html) ?? readJsonLdImage(html) ?? readLogoImage(html);

		return imageUrl ? resolveImageUrl(imageUrl, articleUrl) : undefined;
	} catch {
		return undefined;
	} finally {
		clearTimeout(timeout);
	}
};

const readMetaImage = (html: string): string | undefined => {
	const metaTag = findMetaTag(html, "property", "og:image") ??
		findMetaTag(html, "property", "og:image:url") ??
		findMetaTag(html, "name", "twitter:image") ??
		findMetaTag(html, "name", "twitter:image:src");

	if (!metaTag) {
		return undefined;
	}

	return readAttribute(metaTag, "content");
};

const findMetaTag = (html: string, attributeName: string, attributeValue: string): string | undefined => {
	const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

	return metaTags.find((tag) => {
		const value = readAttribute(tag, attributeName);
		return value?.toLowerCase() === attributeValue;
	});
};

const readJsonLdImage = (html: string): string | undefined => {
	const scriptTags = html.match(
		/<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi
	) ?? [];

	for (const scriptTag of scriptTags) {
		const jsonText = scriptTag
			.replace(/^<script\b[^>]*>/i, "")
			.replace(/<\/script>$/i, "")
			.trim();
		const imageUrl = readJsonImageValue(jsonText);

		if (imageUrl) {
			return imageUrl;
		}
	}

	return undefined;
};

const readJsonImageValue = (jsonText: string): string | undefined => {
	try {
		const parsed = JSON.parse(jsonText) as unknown;
		return findImageValue(parsed);
	} catch {
		return undefined;
	}
};

const readLogoImage = (html: string): string | undefined => {
	const jsonLdLogo = readJsonLdLogo(html);

	if (jsonLdLogo) {
		return jsonLdLogo;
	}

	return readLinkIcon(html, "apple-touch-icon") ??
		readLinkIcon(html, "apple-touch-icon-precomposed") ??
		readLinkIcon(html, "icon") ??
		readLinkIcon(html, "shortcut icon");
};

const readJsonLdLogo = (html: string): string | undefined => {
	const scriptTags = html.match(
		/<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi
	) ?? [];

	for (const scriptTag of scriptTags) {
		const jsonText = scriptTag
			.replace(/^<script\b[^>]*>/i, "")
			.replace(/<\/script>$/i, "")
			.trim();
		const logoUrl = readJsonLogoValue(jsonText);

		if (logoUrl) {
			return logoUrl;
		}
	}

	return undefined;
};

const readJsonLogoValue = (jsonText: string): string | undefined => {
	try {
		const parsed = JSON.parse(jsonText) as unknown;
		return findLogoValue(parsed);
	} catch {
		return undefined;
	}
};

const findImageValue = (value: unknown): string | undefined => {
	if (typeof value === "string") {
		return value;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			const image = findImageValue(item);
			if (image) return image;
		}
		return undefined;
	}

	if (!value || typeof value !== "object") {
		return undefined;
	}

	const record = value as Record<string, unknown>;
	const image = record.image;

	if (typeof image === "string") {
		return image;
	}

	if (Array.isArray(image)) {
		for (const item of image) {
			const imageValue = findImageValue(item);
			if (imageValue) return imageValue;
		}
	}

	if (image && typeof image === "object") {
		const imageRecord = image as Record<string, unknown>;
		if (typeof imageRecord.url === "string") {
			return imageRecord.url;
		}
	}

	return undefined;
};

const findLogoValue = (value: unknown): string | undefined => {
	if (Array.isArray(value)) {
		for (const item of value) {
			const logo = findLogoValue(item);
			if (logo) return logo;
		}
		return undefined;
	}

	if (!value || typeof value !== "object") {
		return undefined;
	}

	const record = value as Record<string, unknown>;
	const publisherLogo = findLogoObjectUrl(readObjectProperty(record.publisher, "logo"));

	if (publisherLogo) {
		return publisherLogo;
	}

	return findLogoObjectUrl(record.logo);
};

const findLogoObjectUrl = (value: unknown): string | undefined => {
	if (typeof value === "string") {
		return value;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			const logoUrl = findLogoObjectUrl(item);
			if (logoUrl) return logoUrl;
		}
		return undefined;
	}

	if (!value || typeof value !== "object") {
		return undefined;
	}

	const record = value as Record<string, unknown>;
	return typeof record.url === "string" ? record.url : undefined;
};

const readObjectProperty = (value: unknown, propertyName: string): unknown => {
	if (!value || typeof value !== "object") {
		return undefined;
	}

	return (value as Record<string, unknown>)[propertyName];
};

const readLinkIcon = (html: string, relValue: string): string | undefined => {
	const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
	const matchingTag = linkTags.find((tag) => {
		const rel = readAttribute(tag, "rel");
		return rel?.toLowerCase().split(/\s+/).join(" ") === relValue;
	});

	return matchingTag ? readAttribute(matchingTag, "href") : undefined;
};

const readAttribute = (tag: string, attributeName: string): string | undefined => {
	const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const match = tag.match(new RegExp(`${escapedName}\\s*=\\s*["']([^"']+)["']`, "i"));
	const value = match?.[1];

	return value ? decodeHtml(value).trim() : undefined;
};

const resolveImageUrl = (imageUrl: string, articleUrl: string): string | undefined => {
	try {
		return new URL(imageUrl, articleUrl).toString();
	} catch {
		return undefined;
	}
};

const decodeHtml = (value: string): string =>
	value
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
