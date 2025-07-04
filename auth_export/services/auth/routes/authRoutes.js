import { Router } from "express";
import { registerUser, loginUser, forgotPassword, resetPassword, verifyEmail } from "../controller/authController.js";
import { verifyJWT } from "../../../middileware/authMiddleware.js";
import { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validation/authValidation.js";

const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/forgot-password").post(validate(forgotPasswordSchema), forgotPassword);
router.route("/reset-password/:token").post(validate(resetPasswordSchema), resetPassword);
router.route("/verify-email/:token").get(verifyEmail);

// Protected route example
router.route("/protected").get(verifyJWT, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.name}! You have access to protected data.` });
});

export default router;
