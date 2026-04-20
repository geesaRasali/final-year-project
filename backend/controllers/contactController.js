import validator from "validator";
import contactModel from "../models/contactModel.js";

const clean = (value) => (value || "").trim();

const submitContactMessage = async (req, res) => {
	try {
		console.log("DATA RECEIVED:", req.body);

		const name = clean(req.body?.name);
		const email = clean(req.body?.email).toLowerCase();
		const phone = clean(req.body?.phone);
		const message = clean(req.body?.message);

		if (!name || !email || !message) {
			return res.status(400).json({ success: false, message: "Name, email, and message are required" });
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({ success: false, message: "Please enter a valid email" });
		}

		if (name.length > 80) {
			return res.status(400).json({ success: false, message: "Name is too long" });
		}

		if (phone.length > 40) {
			return res.status(400).json({ success: false, message: "Phone/subject is too long" });
		}

		if (message.length < 5 || message.length > 2000) {
			return res.status(400).json({ success: false, message: "Message must be between 5 and 2000 characters" });
		}

		const created = await contactModel.create({
			name,
			email,
			phone,
			message,
		});

		return res.json({
			success: true,
			message: "Message sent successfully",
			data: created,
		});
	} catch (error) {
		console.error("submitContactMessage error:", error);
		return res.status(500).json({ success: false, message: "Failed to send message" });
	}
};

const listContactMessages = async (_req, res) => {
	try {
		const messages = await contactModel.find({}).sort({ createdAt: -1 });
		return res.json({ success: true, data: messages });
	} catch (error) {
		console.error("listContactMessages error:", error);
		return res.status(500).json({ success: false, message: "Failed to load messages" });
	}
};

export { submitContactMessage, listContactMessages };
