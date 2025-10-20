/////////////////////////////////////////////////////////////
// =============== ORBIS APP - DATABASE SEEDER ============ //
// =================== VERSION 1.0 ======================= //
////////////////////////////////////////////////////////////

// ======= Package Imports ======== //
require("dotenv").config({ path: "../../.env" });
const mysql = require("mysql2/promise");
const configFile = require("../config/config");
const mockUsers = require("../db/mock-users.json");

/////////////////////////////////////////////
//// ===== DATABASE CONFIGURATION ===== /////
/////////////////////////////////////////////

const dbConfig = {
  host: configFile.dbConfig.host,
  user: configFile.dbConfig.user,
  password: configFile.dbConfig.password,
};

const schemaName = configFile.dbConfig.database;

// Get admin user from mock-users.json (with pre-defined UUID and hashed password)
const adminUser = mockUsers[0];

/////////////////////////////////////////////
//// ========= SEED FUNCTIONS ========= /////
/////////////////////////////////////////////

async function createDatabase(connection) {
  console.log("Creating database if not exists...");

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${schemaName} 
                         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`Database ${schemaName} created or already exists`);
}

async function createTables(connection) {
  console.log("Creating users table...");

  // Switch to the created database
  await connection.query(`USE ${schemaName}`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id VARCHAR(36) PRIMARY KEY,
      user_firstname VARCHAR(50) NOT NULL,
      user_lastname VARCHAR(50) NOT NULL,
      user_email VARCHAR(100) NOT NULL UNIQUE,
      user_password VARCHAR(255) NOT NULL,
      user_nickname VARCHAR(50),
      user_avatar VARCHAR(255),
      user_address VARCHAR(255),
      user_address_line_2 VARCHAR(100),
      user_city VARCHAR(100),
      user_state VARCHAR(100),
      user_zipcode VARCHAR(20),
      user_role VARCHAR(20) DEFAULT 'user',
      user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("Users table created");
}

async function seedAdminUser(connection) {
  console.log("Seeding admin user...");

  // Check if admin exists
  const [rows] = await connection.execute(
    "SELECT * FROM users WHERE user_email = ?",
    [adminUser.user_email]
  );

  if (rows.length > 0) {
    console.log("Admin user already exists");
    return;
  }

  // Insert admin user with pre-hashed password from mock-users.json
  await connection.execute(
    `
    INSERT INTO users (
      user_id, user_firstname, user_lastname, user_email, user_password,
      user_nickname, user_avatar, user_address, user_address_line_2,
      user_city, user_state, user_zipcode, user_role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      adminUser.user_id,
      adminUser.user_firstname,
      adminUser.user_lastname,
      adminUser.user_email,
      adminUser.user_password,
      adminUser.user_nickname,
      adminUser.user_avatar,
      adminUser.user_address,
      adminUser.user_address_line_2,
      adminUser.user_city,
      adminUser.user_state,
      adminUser.user_zipcode,
      adminUser.user_role,
    ]
  );

  console.log("Admin user created successfully");
}

///////////////////////////////////////////////////////////////////////
// ========================= RUN SEEDER =========================== //
///////////////////////////////////////////////////////////////////////

async function runSeeder() {
  console.log("Starting database seeder...");
  let connection = null;

  try {
    // Create a single connection for all operations
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true, // Allow multiple statements per query
    });

    // Execute all seeding operations with the same connection
    await createDatabase(connection);
    await createTables(connection);
    await seedAdminUser(connection);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  } finally {
    // Always close the connection when done
    if (connection) {
      console.log("Closing database connection...");
      await connection.end();
    }
  }
}

// Execute the seeder
runSeeder();

module.exports = { runSeeder };
