import express from "express";
import * as auth from "../controller/auth.js";

const router = express.Router();

router.route("/register").get(auth.renderRegister).post(auth.register);
router.route("/login").get(auth.renderLogin).post(auth.login);
router.get("/home", (req, res) => res.render("frontPage"));
router.get("/logout", auth.logout);

export default router;
