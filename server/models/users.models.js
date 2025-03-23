import mongoose, { Schema, SchemaType } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userScheme = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true

    },
    fullName: {
        type: String,
        trim: true,
        index: true
    }
    ,
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
            ref: "Videos"
        }
    ],
    password: {
        type: String, required: [true, 'password is required']
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });
userScheme.plugin(aggregatePaginate);
userScheme.pre('save', async function (next) {
    if (!this.modified('password')) {
        return next();
    }
    this.password = bcrypt.hash(this.password, 10, function (err, hash) {
        // Store hash in your password DB.
    });
    next();
});
userScheme.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);

}
userScheme.methods.generateAccessToken = function () {
    //short lived access token

    jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn:  process.env.ACCESS_TOKEN_EXPIRY });

}

userScheme.methods.generateRefreshToken = function () {
    //short lived refersh token

    jwt.sign({
        _id: this._id,
      
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn:  process.env.REFRESH_TOKEN_EXPIRY });

}
export const User = mongoose.model("User", userScheme);