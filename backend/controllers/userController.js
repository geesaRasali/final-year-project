import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import crypto from "crypto"

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildAvatarUrl = (email) => {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const hash = crypto.createHash("md5").update(normalizedEmail).digest("hex");
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=128`;
}

// ================= PROFILE =================
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).select("name username email");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: buildAvatarUrl(user.email),
            },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// ================= LOGIN =================
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const loginIdentifier = (username || "").trim();

        if (!loginIdentifier || !password) {
            return res.json({ success: false, message: "Please enter username and password" });
        }

        const user = await userModel.findOne({
            $or: [
                { username: { $regex: `^${escapeRegex(loginIdentifier)}$`, $options: "i" } },
                { email: loginIdentifier.toLowerCase() },
            ],
        });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: buildAvatarUrl(user.email),
            },
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// ================= REGISTER =================
const registerUser = async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        const normalizedName = (name || "").trim();
        const normalizedEmail = (email || "").trim().toLowerCase();
        const normalizedUsername = (username || "").trim().toLowerCase();

        if (!normalizedName || !normalizedEmail || !normalizedUsername || !password) {
            return res.json({ success: false, message: "Please fill all required fields" });
        }

        // check existing user
        const exists = await userModel.findOne({
            $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
        });

        if (exists) {
            return res.json({ success: false, message: "Username or email already exists" });
        }

        if (!validator.isEmail(normalizedEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // password validation
        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: normalizedName,
            email: normalizedEmail,
            username: normalizedUsername,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: buildAvatarUrl(user.email),
            },
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { loginUser, registerUser, getUserProfile };