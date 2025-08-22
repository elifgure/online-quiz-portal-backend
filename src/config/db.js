const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI çevre değişkeni tanımlanmamış. Lütfen .env dosyasını kontrol edin."
      );
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB bağlandı: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB bağlantı hatası:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
