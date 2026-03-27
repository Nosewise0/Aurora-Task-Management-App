import db from "../config/database.js";

export const renderTask = async (req, res) => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) return res.redirect("/login?error=You must be logged in");

    const [taskCounts] = await db.execute(
      `
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS inProgress,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS upcoming
            FROM tasks
            WHERE user_id = ?
        `,
      [userId],
    );
    const [recentTasks] = await db.execute(
      `
            SELECT title, category, updated_at
            FROM tasks
            WHERE user_id = ?
            ORDER BY updated_at DESC
            LIMIT 5
        `,
      [userId],
    );

    const [teamMembers] = await db.execute(
      `
            SELECT u.username, u.status
            FROM users u
            WHERE u.team_id = (SELECT team_id FROM users WHERE id = ?)
        `,
      [userId],
    );

    res.render("dashboard", {
      totalTasks: taskCounts[0].total,
      inProgress: taskCounts[0].inProgress,
      completed: taskCounts[0].completed,
      upcoming: taskCounts[0].upcoming,
      recentTasks,
      teamMembers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
