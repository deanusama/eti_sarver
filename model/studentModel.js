import mongoose, { Schema } from "mongoose";



const studentSchema = new Schema({

    courseNo: String,

    studentNo: String,
    studentNameA: String,
    studentNameE: String,
    iDNo: String,
    gender: String,
    mobile: String,
    email: String,
    sponser: String,
    fees: String,

    hideStudent: {
        type: Boolean,
        default: false 
    },


    courseId: { type: Schema.Types.ObjectId },

}, { timestamps: true },

    {
        toJson: { virtuals: true },
        toObject: { virtuals: true },
    })

const Student = mongoose.model('Student', studentSchema)
export default Student