import mongoose from "mongoose";

export const connectDB = async () => {
	const databaseUrl = process.env.DATABASE_URL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/food-del";

	try {
		await mongoose.connect(databaseUrl);
		console.log("db connected");
	} catch (error) {
		console.error(
			`Unable to connect to MongoDB at ${databaseUrl}. Start MongoDB locally or update DATABASE_URL to a reachable database.`,
		);
		throw error;
	}
};