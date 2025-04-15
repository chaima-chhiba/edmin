
const mongoose = require("mongoose");
const { logger } = require("../helpers/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB connected");

    mongoose.connection.once("open", () => {
      logger.info("DB connection open");
    });
  } catch (err) {
    logger.error(err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;

