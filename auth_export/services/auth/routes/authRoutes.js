import { Router } from "express";
import { registerUser, loginUser, forgotPassword, resetPassword, verifyEmail,Logout } from "../controller/authController.js";
import { verifyJWT } from "../../../middileware/authMiddleware.js";
import { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validation/authValidation.js";
import asyncHandler from "../../../utils/AsyncHandler.js";
const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/forgot-password").post(validate(forgotPasswordSchema), forgotPassword);
router.route("/reset-password/:token").post(validate(resetPasswordSchema),resetPassword);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/logout").post(asyncHandler(Logout));
// Protected route example
router.route("/protected").get(verifyJWT, (req, res) => {
  res.status(200).json(req.user.email);
});

export default router;
