const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");
const { sendResetEmail } = require("../utils/emailService");

// Kayıt
const register = asyncHandler(async (req, res, next) => {
  const { email, name, password, role } = req.body;
  // Email kontrolü
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(400, "Bu email adresi zaten kayıtlı"));
  }
  // İsim kontrolü
  const existingUserByName = await User.findOne({ name });
  if (existingUserByName) {
    return next(new ApiError(400, "Bu kullanıcı adı zaten alınmış"));
  }
  // Kullanıcı oluştur
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  // Token'lar oluştur
  const payload = { id: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Refresh token'ı kaydet
  user.refreshTokens.push(refreshToken);
  await user.save();
  res.status(201).json(
    new ApiResponse(201, "Kayıt Başarılı.", {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    })
  );
});
// Giriş
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Kullanıcı kontrolü
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError(401, "Geçersiz email veya şifre"));
  }
  // Token'lar oluştur
  const payload = { id: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  // Refresh token'ı kaydet
  user.refreshTokens.push(refreshToken);
  await user.save();
  res.status(200).json(
    new ApiResponse(200, "Giriş Başarılı", {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    })
  );
});

// Token yenileme
const refresh = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ApiError(401, "Refresh token gerekli"));
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    // Kullanıcı ve token kontrolü
    const user = await User.findById(payload.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return next(new ApiError(401, "Geçersiz refresh token"));
    }
    // Yeni access token oluştur
    const newAccessToken = signAccessToken({ id: user._id, role: user.role });
    res.status(200).json(
      new ApiResponse(200, "Access token başarıyla yenilendi", {
        accessToken: newAccessToken,
      })
    );
  } catch (error) {
    return next(new ApiError(401, "Geçersiz refresh token"));
  }
});

// Çıkış İşlemi
const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  const userId = req.user.id;
  if (refreshToken) {
    // refresh token kaldır
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken },
    });
  }
  res.status(200).json(new ApiResponse(200, "Çıkış İşlemi Başarılı"));
});
// Şifre sıfırlama isteği
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(404, "Kullanıcı bulunamadı"));
  }
  // token üret ve usera ekle
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    await sendResetEmail(user.email, resetToken);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Şifre sıfırlama linki email adresinize gönderildi"
        )
      );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ApiError(
        500,
        "Email gönderilemedi. Lütfen daha sonra tekrar deneyin."
      )
    );
  }
});
// Şifre sıfırlama
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email, newPassword } = req.body;
  // token hashle
  const hashedToken = require("crypto")
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // Kullanıcıyı bul
  const user = await User.findOne({
    email,
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError(400, "Geçersiz veya süresi dolmuş token"));
  }
  // Şifreyi güncelle
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res
    .status(200)
    .json(new ApiResponse(200, "Şifreniz başarıyla güncellendi", newPassword));
});
module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
