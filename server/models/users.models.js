import mongoose, { Schema, SchemaType } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userScheme = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    bio: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userScheme.plugin(aggregatePaginate);

userScheme.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userScheme.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userScheme.methods.generateAccessToken = async function () {
  //short lived access token

  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userScheme.methods.generateRefreshToken = async function () {
  //short lived refersh token

  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
export const User = mongoose.model("User", userScheme);
