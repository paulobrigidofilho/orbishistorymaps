//////////////////////////////////////////
// ======= SERVER ERROR HANDLER ======= //
//////////////////////////////////////////

// This module provides a centralized error handling function for server controllers

// ====== handleServerError Function ====== //

const handleServerError = (res, error, message) => {
  console.error(message + ":", error);
  if (error && error.stack) {
    console.error(error.stack);
  }
  const payload = {
    message: error.message || message,
  };
  if (process.env.NODE_ENV === "development") {
    payload.stack = error.stack;
  }
  return res.status(500).json(payload);
};

module.exports = { handleServerError };
