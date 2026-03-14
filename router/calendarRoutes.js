const express = require("express");
const router = express.Router();
const calendarController = require("../controller/calendarController");

router.get("/", calendarController.renderCalendar);

module.exports = router;
