const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "paul",
  password: "1234",
  database: "aurora",
});

module.exports = db;