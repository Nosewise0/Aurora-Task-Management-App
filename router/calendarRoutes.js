import express from "express";
import * as calendarController from "../controller/calendarController.js";

const router = express.Router();

router.get("/", calendarController.renderCalendar);

export default router;
