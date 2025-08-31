const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    refreshTokens: [{
      type: String,
      required: true
    }],
  },
  { timestamps: true }
);

// Şifre hashle
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// // JSON dönüştürürken hassas bilgileri kaldır
// userSchema.methods.toJSON = function() {
//   const userObject = this.toObject();
//   delete userObject.password;
//   delete userObject.refreshTokens;
//   return userObject;
// };

module.exports = mongoose.model("User", userSchema);
