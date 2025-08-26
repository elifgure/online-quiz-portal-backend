const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// Token (Kimlik) Doğrulama
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Erişim token Gerekli"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcının hala var olup olmadığını kontrol et
    const user = await User.findById(decoded.id).select(
      "-password -refreshTokens"
    );
    if (!user) {
      return next(new ApiError(401, "Bu token'a sahip kullanıcı bulunamadı"));
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token süresi dolmuş"));
    }
    return next(new ApiError(401, "Geçersiz token"));
  }
});
// Rol tabanlı yetkilendirme middleware'i
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Önce Giriş Yapmalısınız"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Bu işlem için yetkiniz yok"));
    }
    next();
  };
};
// Sadece kendi kayıtlarına erişim kontrolü
const restrictToOwner = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Önce Giriş Yapmalısınız"));
  }
  // Admin Yetkisi
  if (req.user.role === "admin") {
    return next();
  }
  // Kullanıcı ID'sini kontrol et
  const userId = req.params.userId || req.user._id.toString();
  if (userId !== req.user._id.toString()) {
    return next(
      new ApiError(403, "Sadece kendi kayıtlarınıza erişebilirsiniz")
    );
  }
  next();
};
module.exports = {
  authenticate,
  authorize,
  restrictToOwner,
};
