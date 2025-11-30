//////////////////////////////////////////////////////////////
// =============== ORBIS APP - DATABASE SEEDER ============ //
// =================== VERSION 1.0 ======================== //
//////////////////////////////////////////////////////////////

// ======= Package Imports ======== //
const mysql = require("mysql2/promise");
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

(async () => {
  console.log("Starting seeding...");
  
  // Validate required env vars
  const required = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_PASSWORD", "MYSQL_DATABASE"];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing required env var ${key}. Aborting.`);
      process.exit(1);
    }
  }

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  let hadError = false;

  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(64) PRIMARY KEY,
        user_firstname VARCHAR(100) NOT NULL,
        user_lastname VARCHAR(100) NOT NULL,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        user_password VARCHAR(255) NOT NULL,
        user_nickname VARCHAR(100),
        user_avatar VARCHAR(255),
        user_address VARCHAR(255),
        user_address_line_2 VARCHAR(255),
        user_city VARCHAR(100),
        user_state VARCHAR(100),
        user_zipcode VARCHAR(20)
      )
    `);
    console.log("Users table ensured.");

    const [rows] = await connection.execute(
      "SELECT user_id FROM users WHERE user_email = ?",
      ["admin@orbis.local"]
    );
    if (rows.length === 0) {
      const adminPassword = process.env.ADMIN_DEV_PASSWORD;
      if (!adminPassword) {
        console.warn("ADMIN_DEV_PASSWORD not set. Skipping admin user creation.");
      } else {
        const bcrypt = require("bcrypt");
        const { v4: uuidv4 } = require("uuid");
        const hashed = await bcrypt.hash(adminPassword, 10);
        await connection.execute(
          `INSERT INTO users (user_id, user_firstname, user_lastname, user_email, user_password, user_nickname)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [uuidv4(), "Admin", "User", "admin@orbis.local", hashed, "admin"]
        );
        console.log("Admin user seeded (password not logged).");
      }
    } else {
      console.log("Admin user already exists.");
    }

    console.log("Seeding completed.");
  } catch (err) {
    console.error("Seeding error:", err);
    hadError = true;
  } finally {
    await connection.end();
    console.log("Seeding script finished.");
    process.exit(hadError ? 1 : 0);
  }
})();
