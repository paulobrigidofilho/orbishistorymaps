/////////////////////////////////////////
// ===== SESSION MIDDLEWARE ========= ///
/////////////////////////////////////////

// This middleware sets up session management using express-session
// with a MySQL session store and includes retry logic for database connection

// ===== Module Imports ===== //
const session = require("express-session");
const MySQLStoreFactory = require("express-mysql-session");
const MemoryStore = session.MemoryStore;

// ===== Session Middleware Setup ===== //
function createSessionMiddleware(authConfig, dbConfig) {
  let sessionStore = new MemoryStore();

  const sessionStoreOptions = {
    host: dbConfig.host,
    port: dbConfig.port || 3306,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
  };

  const sessionMiddleware = session({
    name: authConfig.session.cookieName,
    secret: authConfig.session.secret,
    resave: authConfig.session.resave,
    saveUninitialized: authConfig.session.saveUninitialized,
    cookie: authConfig.session.cookie,
    store: sessionStore,
  });

  console.log("Session middleware initialized with temporary in-memory store.");

  // Async initialization of MySQL store with retry logic
  const maxAttempts = 5;
  function initMySQLSessionStore(attempt = 1) {
    console.log(
      `Initializing MySQL session store (attempt ${attempt}/${maxAttempts})`
    );
    try {
      const MySQLStore = MySQLStoreFactory(session);
      const store = new MySQLStore(sessionStoreOptions);

      store.on("connect", () => {
        console.log("Session store connected to MySQL successfully.");
        sessionStore = store;
        sessionMiddleware.store = sessionStore;
        console.log("Session middleware store swapped to MySQL store.");
      });

      store.on("error", (err) => {
        console.error("Session store error:", err.message);
        if (attempt < maxAttempts) {
          const delay = Math.min(1000 * attempt, 5000);
          console.log(`Retrying session store in ${delay}ms...`);
          setTimeout(() => initMySQLSessionStore(attempt + 1), delay);
        } else {
          console.warn(
            "Max session store attempts reached. Using in-memory session store (NOT for production)."
          );
        }
      });
    } catch (e) {
      console.error("Session store initialization exception:", e.message);
      if (attempt < maxAttempts) {
        const delay = Math.min(1000 * attempt, 5000);
        console.log(`Retrying session store in ${delay}ms...`);
        setTimeout(() => initMySQLSessionStore(attempt + 1), delay);
      } else {
        console.warn(
          "Failed to initialize MySQL session store after retries. Falling back to MemoryStore."
        );
      }
    }
  }

  initMySQLSessionStore();

  return { sessionMiddleware, getSessionStore: () => sessionStore };
}

module.exports = { createSessionMiddleware };
