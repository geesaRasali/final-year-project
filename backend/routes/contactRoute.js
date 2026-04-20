import express from "express";
import authMiddleware from "../middleware/auth.js";
import { requireRoles } from "../middleware/authorize.js";
import { USER_ROLES } from "../constants/roles.js";
import { listContactMessages, submitContactMessage } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContactMessage);

contactRouter.get(
  "/list",
  authMiddleware,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.MANAGEMENT_STAFF),
  listContactMessages
);

export default contactRouter;