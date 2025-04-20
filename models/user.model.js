import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const isEmail = validator.isEmail;

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "username required"],
      unique: true,
    },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email required"],
      validate: [isEmail, "invalid email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      minLength: [6, "password must be atleast 6 characters long"],
    },
    age: {
      type: String,
    },
    country: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    resetToken: { type: String, default: "" },
    resetTokenExpiry: { type: Date },
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.password) return new Error("password required");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const userInfo = await this.findOne({ email }).select(
        "username age country email role createdAt isVerified profileImage"
      );
      return userInfo;
    }
    throw new Error("wrong password");
  }
  throw new Error("user not exist");
};

const User = mongoose.model("users", userSchema);

export default User;
