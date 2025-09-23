const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Profil görüntüleme
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ApiError(404, "Kullanıcı Bulanamadı."));
  }
  res.status(200).json(new ApiResponse(200, "Profil Bilgileri", user));
});
// Tüm kullanıcıları listele (Admin)
const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (
    req.query.role &&
    ["teacher", "student", "admin"].includes(req.query.role)
  ) {
    filter.role = req.query.role;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshTokens -__v")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(), // performans için Mongoose Document yerine düz JS objesi döndürür.
    User.countDocuments(filter),
  ]);
  return res.status(200).json(
    new ApiResponse(200, "Kullanıcılar Listelendi", {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});

// Rol Güncelleme İşlemi
const updateRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!["teacher", "student", "admin"].includes(role)) {
    return next(new ApiError(400, "Geçersiz Rol"));
  }
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );
  if (!user) {
    return next(new ApiError(404, "Kullanıcı Bulunamadı"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Kullanıcı Rolü Güncellendi", user));
});
// Kullanıcı silme işlemi (Admin)
const deleteUser = asyncHandler(async (req, res, next)=>{
  const {id} = req.params
  const user = await User.findByIdAndDelete(id)
  if(!user) return next(new ApiError(404, "Kullanıcı Bulunamadı"))
    res .status(200).json(new ApiResponse(200, "Kullanıcı Silindi", null))
})
module.exports = {
  getProfile,
  getAllUsers,
  updateRole,
  deleteUser
};
