import mongoose from "mongoose";
import { USER_ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    role: {
        type: String,
        enum: Object.values(USER_ROLES),
        default: USER_ROLES.CUSTOMER
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    username: { 
        type: String, 
        required: true, 
        unique: true 
    },

    password: { type: String, required: true },
    profileImage: { type: String, default: '' },
    cartData: { type: Object, default: {} }
},{ minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;