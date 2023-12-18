import { Router } from "express";
import passport from "passport";
//importar el controlador de Sessions
import { SessionsController } from "../controllers/sessions.controller.js";
import { uploaderProfile } from "../utils.js";
const router  = Router();

router.post("/signup",uploaderProfile.single("avatar"), passport.authenticate("signupStrategy", {
    failureRedirect:"/api/sessions/fail-signup"
}), SessionsController.successSignup);

router.get("/fail-signup", SessionsController.failSignup);


router.post("/login", passport.authenticate("loginStrategy", {
    failureRedirect:"/api/sessions/fail-login"
}), SessionsController.renderProfile);

router.get("/fail-login", SessionsController.failLogin);

router.post("/forgot-password", SessionsController.forgotPassword);

router.post("/reset-password", SessionsController.resetPassword);

router.get("/logout", SessionsController.logout);
router.get("/login", SessionsController.successLogin);
router.post("/login", SessionsController.redirectLogin);
//router.get("/github/callback",SessionsController ,AuthController.githubAuthCallback);
export {router as sessionsRouter};