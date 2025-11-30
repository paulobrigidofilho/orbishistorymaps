////////////////////////////////////
// ===== AUTH CONFIGURATION ===== //
////////////////////////////////////

// This configuration file sets up authentication parameters
// such as bcrypt settings and session management options.

// ===== Auth Configuration ===== //

const authConfig = {
  bcrypt: { saltRounds: 10 },
  session: {
    secret: process.env.SESSION_SECRET,
    cookieName: process.env.SESSION_COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  },
};

if (!process.env.SESSION_SECRET) {
  console.warn("WARNING: SESSION_SECRET missing. Set it in .env for a public repo.");
}
if (!process.env.SESSION_COOKIE_NAME) {
  console.warn("INFO: SESSION_COOKIE_NAME not set, using default 'connect.sid'.");
}

module.exports = { authConfig };
