const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// MongoDB injection önleme için custom middleware
const customMongoSanitize = (req, res, next) => {
  const sanitizeValue = (obj) => {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        sanitizeValue(obj[key]);
      } else {
        if (typeof obj[key] === 'string') {
          // MongoDB operatör karakterlerini kontrol et
          if (obj[key].includes('$') || obj[key].includes('.')) {
            delete obj[key];
          }
        }
      }
    }
    return obj;
  };

  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);
  
  next();
};

const applySecurity = (app) => {
  // Helmet - güvenlik headers
  // Helmet güvenlik başlıkları
  app.use(
    helmet({
      contentSecurityPolicy: false, // Swagger için devre dışı
      crossOriginEmbedderPolicy: false,
      xssFilter: true, // XSS koruması aktif
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

  // NoSQL injection temizleme - custom middleware
  app.use(customMongoSanitize);
  
  // HTTP parametre kirlenmesi önleme
  app.use(
    hpp({
      whitelist: ["sort", "fields", "page", "limit", "category"],
    })
  );
};
module.exports = applySecurity;