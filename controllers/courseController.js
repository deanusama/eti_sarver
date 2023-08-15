import { StatusCodes } from "http-status-codes";
import Course from "../model/courseModel.js";



export const addCourse = async (req, res) => {

    const { files, body } = req
    const certificateDocs = files.map((file) => ({ name: file.originalname, documentURL: file.path }))


    try {

        const course = await Course.create({
            ...body, certificateDocs
        });

        res.status(StatusCodes.CREATED).json({ course })


    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }
}

export const allCourse = async (req, res) => {


    try {
        const course = await Course.find({}).populate('student').lean()
        res.status(StatusCodes.OK).json({ course })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}

export const hideCourses = async (req, res) => {

    const hideCoursesIds = req.body

    try {

        const updateOperation = {
            $set: { hideCourse: true } // The fields and values you want to update
        };


        await Course.updateMany(
            { _id: { $in: hideCoursesIds } },
            updateOperation
        )



        res.status(StatusCodes.OK).json({ message: "Student deleted successfully", hideCoursesIds })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }

}

export const getUpdateCourse = async (req, res) => {

    const id = req.params.id;

    try {

        const course = await Course.findById(id)

        if (!course) {
            throw new Error(`No property with with this Id ${id}`)
        }

        res.status(StatusCodes.OK).json({ course })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    }
}

export const editCourse = async (req, res) => {

    const { files, body } = req
    const newCertificateDocs = files.map((file) => ({ name: file.originalname, documentURL: file.path }))

    const { certificateDocs: _, id, previousCertificateDocs: rawPreviousCertificateDocs, ...rest } = body
    const previousCertificateDocs = JSON.parse(rawPreviousCertificateDocs)

    const certificateDocs = [...newCertificateDocs, ...previousCertificateDocs]

    try {
        const course = await Course.findOne({ _id: id })

        if (!course) {
            throw new Error(`No course with with ID ${id}`)
        }

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: id },
            {
                ...rest,
                certificateDocs
            },
            { new: true, runValidators: true })
        res.status(StatusCodes.OK).json({ updatedCourse })


    } catch (error) {

        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }


}