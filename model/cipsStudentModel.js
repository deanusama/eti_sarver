import mongoose, { Schema } from "mongoose";



const cipsStudentSchema = new Schema({

    name: String,
    membership: String,
    email: String,
    password: String,
    dateOfJoin: String,
    expiryDate: String,
    courseTitle: String,
    idNo: String,
    gender: String,
    dOfBirth: String,
    sponser: String,
    sponserEmail: String,
    group: String,
    fees: String,

    hideCipsStudent: {
        type: Boolean,
        default: false
    },
    cipsDocs: [{
        name: String,
        documentURL: String
    }],

    examDetail: [{
        module: String,
        AttendenceDateFrom: String,
        AttendenceDateTo: String,
        examDate: String,
        result: String,
        remarks: String,

    }]


})



const CipsStudent = mongoose.model('CipsStudent', cipsStudentSchema)
export default CipsStudent