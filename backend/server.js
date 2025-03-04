//========== PACKAGE IMPORTS ==========//
const express = require("express")
const cors = require("cors")
require("dotenv").config()

//========== ROUTE IMPORTS ==========//

//========= Login / Register ============ //

// const routeA = require("./a")

//========== ENABLE EXPRESS ==========//
const app = express()

//========== MIDDLEWARE ==========//
app.use(cors()) // to allow server to accept requests from different domains or ports from frontend
app.use(express.json()) // parses incoming JSON payloads and converts them into JavaScript objects that are accessible via req.body

//========== USING THE ROUTES ==========//
// app.use(ROUTENAME)

//============= PORT =================//
const PORT = process.env.PORT || 4000

app
  .listen(PORT, () => {
    console.log(`Server is alive on http://localhost:${PORT}`)
  })
  .on("error", error => {
    if (error.code === "EADDRINUSE") {
      console.log("Port is already in use")
    } else {
      console.log("Server Error", error)
    }
  })
