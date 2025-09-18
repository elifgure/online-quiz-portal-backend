// express app setup
const express = require("express");
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger');
const applySecurity = require("../middlewares/security");
const { notFound, errorHandler } = require("../middlewares/error");

// Routes import
const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const questionRoutes = require("../routes/question.routes");
const quizRoutes = require("../routes/quiz.routes");
const resultRoutes = require("../routes/result.routes");

function expressLoader() {
  const app = express();

  // Güvenlik middleware'leri
  applySecurity(app);

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

  // Socket.IO test endpoint
  app.get("/socket-test", (req, res) => {
    const port = process.env.PORT || 5000;
    res.status(200).json({
      success: true,
      message: "Socket.IO server çalışıyor",
      postman_instructions: {
        step1: `GET http://localhost:${port}/socket.io/?EIO=4&transport=polling&token=YOUR_JWT_TOKEN`,
        step2: "Copy the sid from response",
        step3: `POST http://localhost:${port}/socket.io/?EIO=4&transport=polling&sid=COPIED_SID`,
        step4: "Body: 42[\"ping\"]",
        step5: `GET http://localhost:${port}/socket.io/?EIO=4&transport=polling&sid=COPIED_SID (to receive messages)`
      }
    });
  });

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/questions", questionRoutes);
  app.use("/api/quizzes", quizRoutes);
  app.use("/api/results", resultRoutes);

  //404 Handler
  app.use(notFound);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

module.exports = expressLoader
