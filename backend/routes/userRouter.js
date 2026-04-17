import express from "express"
import multer from "multer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import {loginUser,registerUser,getUserProfile,updateUserProfile,googleLoginUser} from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imagesDir = path.resolve(__dirname, "..", "images")

if (!fs.existsSync(imagesDir)) {
	fs.mkdirSync(imagesDir, { recursive: true })
}

const storage = multer.diskStorage({
	destination: imagesDir,
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}${file.originalname}`);
	},
});

const upload = multer({ storage });
const uploadProfileImage = (req, res, next) => {
	upload.single("image")(req, res, (err) => {
		if (err) {
			return res.json({ success: false, message: err.message || "Image upload failed" })
		}
		next()
	})
}

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/google-login",googleLoginUser)
userRouter.get("/profile",authMiddleware,getUserProfile)
userRouter.post("/update",authMiddleware,uploadProfileImage,updateUserProfile)

export default userRouter;