import mongoose from "mongoose";
import crypto from "crypto";
import { type } from "os";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      require: true,

      max: 50,
      unique: true,
    },
    salt: { type: String },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,

      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: String,
      max: 50,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = crypto.randomBytes(16).toString("hex");
  this.salt = salt;
  this.password = crypto
    .pbkdf2Sync(this.password, salt, 1000, 64, "sha512")
    .toString("hex");
  next();
});

userSchema.methods.validatePassword = async function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.password === hash;
};
const User = mongoose.model("User", userSchema);
export default User;
