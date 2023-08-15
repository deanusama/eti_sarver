import mongoose, { Schema } from "mongoose";



const courseSchema = new Schema({

    courseNo: String,
    courseTitleA: String,
    courseTitleE: String,
    durationFrom: String,
    durationTo: String,
    level: String,
    licenseNumber: String,
    authentication: String,
    trainerName: String,
    venue: String,
    language: String,
    sponserName: String,
    fees: String,
    certificate: String,
    sponser: String,

    certificateDocs: [{
            name: String,
            documentURL: String
        }],

    hideCourse: {
        type: Boolean,
        default: false
    }


}, { timestamps: true },
    {
        toJson: { virtuals: true },
        toObject: { virtuals: true },
    })


courseSchema.virtual('student', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'courseId',
})

const Course = mongoose.model('Course', courseSchema)
export default Course