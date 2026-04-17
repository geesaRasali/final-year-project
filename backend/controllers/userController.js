import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library"

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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

const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return "";
    if (profileImage.startsWith("http://") || profileImage.startsWith("https://")) {
        return profileImage;
    }
    return `/images/${profileImage}`;
}

const buildUsernameBase = (name, email) => {
    const fallback = (email || "customer").split("@")[0] || "customer";
    const source = (name || fallback).toLowerCase();
    const cleaned = source.replace(/[^a-z0-9]/g, "");
    return cleaned || "customer";
}

const createUniqueUsername = async (name, email) => {
    const base = buildUsernameBase(name, email);
    let username = base;
    let counter = 0;

    while (await userModel.findOne({ username })) {
        counter += 1;
        username = `${base}${counter}`;
    }

    return username;
}

// ================= PROFILE =================
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const user = await userModel.findById(userId).select("name username email role profileImage");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImage: getProfileImageUrl(user.profileImage),
                avatar: buildAvatarUrl(user.email),
            },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// ================= UPDATE PROFILE =================
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        if (!userId) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }
        const {
            name,
            username,
            email,
            password,
        } = req.body;
        const uploadedImage = req.file?.filename || "";

        const currentUser = await userModel.findById(userId);

        if (!currentUser) {
            return res.json({ success: false, message: "User not found" });
        }

        const normalizedName = (name || currentUser.name).trim();
        const normalizedUsername = (username || currentUser.username).trim().toLowerCase();
        const normalizedEmail = (email || currentUser.email).trim().toLowerCase();

        if (!normalizedName || !normalizedUsername || !normalizedEmail) {
            return res.json({ success: false, message: "Please fill all required fields" });
        }

        if (!validator.isEmail(normalizedEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        const usernameExists = await userModel.findOne({
            username: normalizedUsername,
            _id: { $ne: userId },
        });

        if (usernameExists) {
            return res.json({ success: false, message: "Username already exists" });
        }

        const emailExists = await userModel.findOne({
            email: normalizedEmail,
            _id: { $ne: userId },
        });

        if (emailExists) {
            return res.json({ success: false, message: "Email already exists" });
        }

        currentUser.name = normalizedName;
        currentUser.username = normalizedUsername;
        currentUser.email = normalizedEmail;

        if (uploadedImage) {
            currentUser.profileImage = uploadedImage;
        }

        if (password && password.trim()) {
            if (password.trim().length < 6) {
                return res.json({ success: false, message: "Password must be at least 6 characters" });
            }

            const salt = await bcrypt.genSalt(10);
            currentUser.password = await bcrypt.hash(password.trim(), salt);
        }

        await currentUser.save();

        res.json({
            success: true,
            user: {
                name: currentUser.name,
                username: currentUser.username,
                email: currentUser.email,
                role: currentUser.role,
                profileImage: getProfileImageUrl(currentUser.profileImage),
                avatar: buildAvatarUrl(currentUser.email),
            },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error?.message || "Error" });
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
                role:user.role,
                profileImage: getProfileImageUrl(user.profileImage),
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
    const { name, email, username, password, role } = req.body;
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
            password: hashedPassword,
            role: role || "customer"
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
                role: user.role,
                profileImage: getProfileImageUrl(user.profileImage),
                avatar: buildAvatarUrl(user.email),
            },
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// ================= GOOGLE LOGIN (CUSTOMER ONLY) =================
const googleLoginUser = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.json({ success: false, message: "Google auth is not configured on server" });
        }

        if (!credential) {
            return res.json({ success: false, message: "Google credential is required" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.json({ success: false, message: "Invalid Google account payload" });
        }

        const email = payload.email.toLowerCase();
        const name = payload.name || "Google User";
        const avatar = payload.picture || buildAvatarUrl(email);

        let user = await userModel.findOne({ email });

        if (user && user.role !== "customer") {
            return res.json({ success: false, message: "Google login is only available for customer accounts" });
        }

        if (!user) {
            const username = await createUniqueUsername(name, email);
            const randomPassword = crypto.randomBytes(24).toString("hex");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            const newUser = new userModel({
                name,
                email,
                username,
                password: hashedPassword,
                role: "customer",
            });

            user = await newUser.save();
        }

        const token = createToken(user._id);
        return res.json({
            success: true,
            token,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImage: getProfileImageUrl(user.profileImage),
                avatar,
            },
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Google login failed" });
    }
}

export { loginUser, registerUser, getUserProfile, updateUserProfile, googleLoginUser };