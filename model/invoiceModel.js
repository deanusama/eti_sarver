import mongoose, { Schema } from "mongoose";



const invoiceSchema = new Schema({

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

})

const Invoice = mongoose.model('Invoice', invoiceSchema)
export default Invoice