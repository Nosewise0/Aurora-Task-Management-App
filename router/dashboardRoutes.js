import express from "express";
import * as dashboard from "../controller/dashboard.js";

const router = express.Router();

router.route('/').get(dashboard.renderTask);

export default router;