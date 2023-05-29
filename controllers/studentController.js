import { StatusCodes } from "http-status-codes";
import Student from "../model/studentModel.js";
import Invoice from "../model/invoiceModel.js";


export const addStudent = async (req, res) => {

    try {
        const student = await Student.create({ ...req.body })
        await Invoice.create({ ...req.body })

        res.status(StatusCodes.CREATED).json({ student })

        console.log(student);

    } catch (error) {

        res.status(StatusCodes.CREATED).json({ msg: error.message })
    }
}


export const allStudent = async (req, res) => {


    try {
        const students = await Student.find({})
        res.status(StatusCodes.OK).json({ students })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}


export const allStudentInvoices = async (req, res) => {


    try {
        const studentInvoices = await Invoice.find({})
        res.status(StatusCodes.OK).json({ studentInvoices })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}

export const hideStudents = async (req, res) => {

    const hideStudentIds = req.body

    try {

        const updateOperation = {
            $set: { hideStudent: true } // The fields and values you want to update
        };


        await Student.updateMany(
            { _id: { $in: hideStudentIds } },
            updateOperation
        )



        res.status(StatusCodes.OK).json({ message: "Student deleted successfully", hideStudentIds })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }

}

export const getUpdateStudent = async (req, res) => {

    const id = req.params.id;

    try {

        const student = await Student.findById(id)

        if (!student) {
            throw new Error(`No property with with this Id ${id}`)
        }

        res.status(StatusCodes.OK).json({ student })
    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}




export const editStudent = async (req, res) => {

    console.log(req.body);

    const { studentNo, studentNameA, studentNameE, iDNo, gender, mobile, email, sponser, fees } = req.body

    const id = req.params.id

    // console.log(req.body);
    try {
        const student = await Student.findOne({ _id: id })

        // look it after this task
        // createdBy: req.user.userId

        if (!student) {
            throw new Error(`No course with with ID ${id}`)
        }

        const updatedStudent = await Student.findOneAndUpdate({ _id: id }
            , { $set: { studentNo, studentNameA, studentNameE, iDNo, gender, mobile, email, sponser, fees } },
            { new: true, runValidators: true })
        res.status(StatusCodes.OK).json({ updatedStudent })

    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }


}


export const editStudentInvoice = async (req, res) => {

    const { __v, _id, ...rest } = req.body

    const id = req.params.id
    try {
        const invoice = await Invoice.findOne({ _id: id })

        // look it after this task
        // createdBy: req.user.userId

        if (!invoice) {
            throw new Error(`No invoice with with ID ${id}`)
        }

        const updatedInvoice = await Invoice.findOneAndUpdate({ _id: id },
            { $set: { ...rest } },
            { new: true, runValidators: true })

        res.status(StatusCodes.OK).json({ updatedInvoice })

    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }


}