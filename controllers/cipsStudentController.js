import { StatusCodes } from "http-status-codes";
import CipsStudent from "../model/cipsStudentModel.js";



export const addCipsStudent = async (req, res) => {


    try {

        const cipsStudent = await CipsStudent.create({
            ...req.body,
        });
        res.status(StatusCodes.CREATED).json({cipsStudent})


    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }
}

export const allCipsStudent = async (req, res) => {


    try {
        const cipsStudent = await CipsStudent.find({})
        res.status(StatusCodes.OK).json({ cipsStudent })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}

export const hideCipsStudent = async (req, res) => {

    console.log(req.body);

    const hideCipsStudentIds = req.body

    try {

        const updateOperation = {
            $set: { hideCipsStudent: true } // The fields and values you want to update
        };


        await CipsStudent.updateMany(
            { _id: { $in: hideCipsStudentIds } },
            updateOperation
        )



        res.status(StatusCodes.OK).json({ message: "Student deleted successfully", hideCipsStudentIds })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }

}

export const getUpdateCipsStudent = async (req, res) => {

    const id = req.params.id;

    try {

        const cipsStudent = await CipsStudent.findById(id)

        if (!cipsStudent) {
            throw new Error(`No Cips Student with with this Id ${id}`)
        }

        res.status(StatusCodes.OK).json({ cipsStudent })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}

export const editCipsStudent = async (req, res) => {

    const id = req.params.id


    try {

        const cipsStudent = await CipsStudent.findOne({ _id: id })

        // look it after this task
        // createdBy: req.user.userId

        if (!cipsStudent) {
            throw new Error(`No Cips Student with with ID ${id}`)
        }

        const updatedCipsStudent = await CipsStudent.findOneAndUpdate(
            { _id: id },

            req.body,
   
            { new: true, runValidators: true })
            res.status(StatusCodes.OK).json({ updatedCipsStudent })

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }
}