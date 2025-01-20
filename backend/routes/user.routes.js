import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
	followUnfollowUser,
	getSuggestedUsers,
	getUserProfile,
	updateUser,
	getLeaderboard,
	getCreditScore, // Import the new controller
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);

// New route for getting user's credit score
router.get("/credit-score", protectRoute, getCreditScore); // This route will send the credit score data



// New route for leaderboard
router.get("/leaderboard", protectRoute, getLeaderboard);

export default router;

