require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const { logger } = require("./helpers/logger");
global.logger = logger;

const corsOptions = require("./config/cors");
const connectDB = require("./config/database");
const hubspotClient = require("./config/hubSpot");
global.hubspotClient = hubspotClient;
const credentials = require("./middleware/credentials");
const errorHandlerMiddleware = require("./middleware/error_handler");
const apiRoutes = require("./routes/api");
const morgan = require("morgan");

const app = express();
const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
  });
});

// App logs
app.use(
  morgan("combined", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
    stream: logger.stream,
  })
);

// Allow Credentials
app.use(credentials);

// CORS
app.use(cors(corsOptions));

// application/x-www-form-urlencoded with a higher limit
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// application/json response with a higher limit
app.use(express.json({ limit: '10mb' }));

// Static files
app.use("/static", express.static(path.join(__dirname, "public")));

// Default error handler
app.use(errorHandlerMiddleware);

// Routes
app.use("/api", apiRoutes);
app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});
