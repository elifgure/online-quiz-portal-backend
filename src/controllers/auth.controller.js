const User = require("..models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");

// Kayıt
const register = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;
  // Email kontrolü
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(400, "Bu email adresi zaten kayıtlı"));
  }
  // Kullanıcı oluştur
  const user = await User.create({
    name,
    email,
    password,
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