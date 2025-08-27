// express app setup
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const applySecurity = require("../middlewares/security");
const { notFound, errorHandler } = require("../middlewares/error");

// Routes import
const authRoutes = require("../routes/auth.routes");

function expressLoader() {
  const app = express();

  // Güvenlik middleware'leri
  applySecurity(app);

  // middlewares
  app.use(cors()); 

  // body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "API çalışıyor.",
      timestamp: new Date().toISOString(),
    });
  });
  // API Routes
  app.use("/api/auth", authRoutes);

  //404 Handler
  app.use(notFound);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

module.exports = express;
