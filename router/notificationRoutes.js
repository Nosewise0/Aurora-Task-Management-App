const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const notifications = [
    {
      id: 1,
      title: "Welcome to Aurora",
      body: "Your workspace is ready. Start by creating your first project.",
      createdAt: "Just now",
      read: false,
      type: "info",
    },
    {
      id: 2,
      title: "Project updated",
      body: "The status of “Website Redesign” was changed to Active.",
      createdAt: "Today",
      read: true,
      type: "activity",
    },
  ];

  res.render("notifications", { notifications });
});

router.get("/receive", (req, res) => {
  res.json({ message: "Notification example" });
});

module.exports = router;
