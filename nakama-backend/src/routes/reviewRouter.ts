import { ObjectId } from "mongodb";
import { Review } from "../models/reviewModel";
import express from "express";
import { db } from "../db";

const reviewRouter = express.Router();

// Always send a proper 500 so the frontend can distinguish errors
// from successful responses by HTTP status code alone.
const errorHandler = (error: any, res: any) => {
	console.error(error);
	res.status(500).json({ message: `ERROR: ${error}` });
};

// Validate that incoming review POST bodies have the required shape.
// Returning a string means validation failed (it's the error message);
// returning null means the body is valid.
const validateReview = (body: any): string | null => {
	if (!body.review || typeof body.review !== "string" || body.review.trim() === "") {
		return "review text is required";
	}
	if (typeof body.score !== "number" || body.score < 0 || body.score > 10) {
		return "score must be a number between 0 and 10";
	}
	if (!body.type || typeof body.type !== "string") {
		return "type is required";
	}
	if (
		!body.entry ||
		typeof body.entry.id !== "number" ||
		typeof body.entry.title !== "string" ||
		typeof body.entry.imageUrl !== "string"
	) {
		return "entry must include id (number), title, and imageUrl";
	}
	return null;
};

// GET all reviews — must be registered BEFORE /reviews/:id
// so Express doesn't treat the empty string as an id match.
reviewRouter.get("/reviews/", async (req: any, res: any) => {
	try {
		const reviewsCollection = db().collection<Review>("reviews");
		const result = await reviewsCollection.find().toArray();
		res.status(200).json(result);
	} catch (error) {
		errorHandler(error, res);
	}
});

// GET reviews for a specific anime by MAL id
reviewRouter.get("/reviews/:id", async (req: any, res: any) => {
	try {
		const reviewsCollection = db().collection<Review>("reviews");
		const result = await reviewsCollection
			.find({ "entry.id": parseInt(req.params.id) })
			.toArray();

		if (result.length === 0) {
			res.status(404).json({
				message: "Be The First To Leave A Review!",
				id: req.params.id,
			});
		} else {
			res.status(200).json(result);
		}
	} catch (error) {
		errorHandler(error, res);
	}
});

// POST a new review — validates body shape before touching the DB
reviewRouter.post("/reviews/post", async (req: any, res: any) => {
	const validationError = validateReview(req.body);
	if (validationError) {
		return res.status(400).json({ message: `Validation error: ${validationError}` });
	}

	try {
		const reviewsCollection = db().collection<Review>("reviews");

		// Only insert the fields we expect — don't blindly pass req.body
		const newReview: Review = {
			userId: req.body.userId,
			type: req.body.type,
			data: req.body.data ?? "",
			review: req.body.review.trim(),
			score: req.body.score,
			entry: {
				id: req.body.entry.id,
				title: req.body.entry.title,
				imageUrl: req.body.entry.imageUrl,
			},
		};

		await reviewsCollection.insertOne(newReview);
		res.status(201).json({ message: "Review created!" });
	} catch (error) {
		errorHandler(error, res);
	}
});

export default reviewRouter;
