import { ObjectId } from "mongodb";
import User from "../models/user";
import { Review } from "../models/reviewModel";
import express from "express";
import { db } from "../db";

const userRouter = express.Router();

const errorHandler = (error: any, res: any) => {
	console.error(error);
	res.status(500).json({ message: `ERROR: ${error}` });
};

// GET all users — NOTE: returns passwords in plain text.
// This route should be removed or protected before any kind of deployment.
userRouter.get("/users/allUsers", async (req: any, res: any) => {
	try {
		const usersCollection = db().collection<User>("users");
		const result = await usersCollection.find({}).toArray();
		res.status(200).json(result);
	} catch (error) {
		errorHandler(error, res);
	}
});

// GET users by userName — partial, case-insensitive match using a regex.
// e.g. GET /users/search?userName=ken  returns all users whose name contains "ken"
userRouter.get("/users/search", async (req: any, res: any) => {
	const { userName } = req.query;

	if (!userName || typeof userName !== "string") {
		return res.status(400).json({ message: "userName query parameter is required" });
	}

	try {
		const usersCollection = db().collection<User>("users");
		const query = { userName: { $regex: userName, $options: "i" } };
		const result = await usersCollection.find(query).toArray();
		res.status(200).json(result);
	} catch (error) {
		errorHandler(error, res);
	}
});

// GET reviews joined with user info via MongoDB aggregation ($lookup)
userRouter.get("/users/searchReviewsByUser", async (req: any, res: any) => {
	try {
		const reviewsCollection = db().collection<Review>("reviews");
		const result = await reviewsCollection.aggregate([
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user_info",
				},
			},
			{
				$unwind: {
					path: "$user_info",
					// Keep reviews that have no matching user rather than
					// silently dropping them (the original used a strict $unwind)
					preserveNullAndEmptyArrays: true,
				},
			},
		]).toArray();

		res.status(200).json(result);
	} catch (error) {
		errorHandler(error, res);
	}
});

// POST create a new user — insertOne, not insertMany
userRouter.post("/users/post", async (req: any, res: any) => {
	const { userName, password } = req.body;

	if (!userName || typeof userName !== "string" || userName.trim() === "") {
		return res.status(400).json({ message: "userName is required" });
	}
	if (!password || typeof password !== "string" || password.length < 6) {
		return res.status(400).json({ message: "password must be at least 6 characters" });
	}

	try {
		const usersCollection = db().collection<User>("users");

		// Check for duplicate userName before inserting
		const existing = await usersCollection.findOne({ userName: userName.trim() });
		if (existing) {
			return res.status(409).json({ message: "Username already taken" });
		}

		const newUser: User = {
			userName: userName.trim(),
			password, // TODO: hash this with bcrypt before any real deployment
			reviews: [],
		};

		await usersCollection.insertOne(newUser);
		res.status(201).json({ message: "User created!" });
	} catch (error) {
		errorHandler(error, res);
	}
});

export default userRouter;
