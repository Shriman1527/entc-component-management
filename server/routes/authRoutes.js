import express from "express";
import { login, logout , getMe} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();



// Everyone can login
router.post("/login", login);
//----
router.post("/logout",logout);

router.get("/me", protect, getMe);

export default router;




/*
//  if we want a login to register student for only admin then we have to implemmt below code 
import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admins can register new users
router.post("/register", protect, adminOnly, register);

// Public login route
router.post("/login", login);

export default router;



*/


