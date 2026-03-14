const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");

router.route("/register").get(auth.renderRegister).post(auth.register);
router.route("/login").get(auth.renderLogin).post(auth.login);
router.get("/home", (req, res) => res.render("frontPage"));
router.get("/logout", auth.logout);

module.exports = router;
