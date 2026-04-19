import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getSingleOrder } from "../controllers/oderController.js"
import { requireRoles } from "../middleware/authorize.js";
import { ORDER_STATUS_UPDATE_ROLES, ORDER_VIEW_ROLES } from "../constants/roles.js";


const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/single", authMiddleware, getSingleOrder);
orderRouter.get("/list", authMiddleware, requireRoles(...ORDER_VIEW_ROLES), listOrders);
orderRouter.post("/status", authMiddleware, requireRoles(...ORDER_STATUS_UPDATE_ROLES), updateStatus);

export default orderRouter;