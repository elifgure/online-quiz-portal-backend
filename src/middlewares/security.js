const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitaze = require("express-mongo-sanitize");
const hpp = require("hpp");

const applySecurity = (app) => {
  // Helmet - güvenlik headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Swagger için devre dışı
      crossOriginEmbedderPolicy: false,
    })
  );
  // CORS
  const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CORS_ORIGINS || "")
        .split(",")
        .filter(Boolean);
      // Development'ta origin kontrolü yapılmasın
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy tarafından engellenmiş"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  app.use(cors(corsOptions));
  // Rate limiting
  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 dakika
    max: Number(process.env.RATE_LIMIT_MAX || 100), // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: "Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", limiter);

  // XSS temizleme
  app.use(xss());

  // NoSQL injection temizleme
  app.use(mongoSanitize());
  // HTTP parametre kirlenmesi önleme
  app.use(
    hpp({
      whitelist: ["sort", "fields", "page", "limit", "category"],
    })
  );
};
module.exports = applySecurity;