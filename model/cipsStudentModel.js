import mongoose, { Schema } from "mongoose";



const cipsStudentSchema = new Schema({

    name: String,
    membership: String,
    email: String,
    password: String,
    dateOfJoin: String,
    expairyDate: String,
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

    examDetail: [{
        module: String,
        moduleExamDateFrom: String,
        moduleExamDateTo: String,
        result: String,
        remarks: String,

    }]


})



const CipsStudent = mongoose.model('CipsStudent', cipsStudentSchema)
export default CipsStudent