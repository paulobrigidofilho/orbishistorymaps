////////////////////////////////////////
// ===== DATABASE CONFIGURATION ===== //
////////////////////////////////////////

// This configuration file sets up database connection parameters
// such as host, port, user, password, and database name.

// ===== Database Configuration ===== //

const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

if (!dbConfig.password) {
  console.warn(
    "WARNING: MYSQL_PASSWORD is not set. Do NOT run this in production."
  );
}

// Create database connection pool
const db = mysql.createPool(dbConfig);

// Test database connection
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to database (pool is open)");
  }
});

module.exports = { dbConfig, db };
