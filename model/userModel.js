import mongoose, { Schema } from "mongoose"
import jwt from 'jsonwebtoken'



const userSchema = new Schema({

    name: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        unique: true
    },

    password: {
        type: String,
    }
})


userSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    )
}


const User = mongoose.model('User', userSchema)
export default User