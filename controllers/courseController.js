import { StatusCodes } from "http-status-codes";
import Course from "../model/courseModel.js";

import fsPromise from 'fs/promises';
// import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
// import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
import Pizzip from 'pizzip';



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
            $set: { hide: true } // The fields and values you want to update
        };


        await Course.updateMany(
            { _id: { $in: hideCoursesIds } }, updateOperation
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
    const id = req.params.id

    const { files, body } = req
    const { certificateDocs: _, previousCertificateDocs: rawPreviousCertificateDocs, ...rest } = body

    try {
        const newCertificateDocs = files.map((file) => ({ name: file.originalname, documentURL: file.path }))
        const previousCertificateDocs = JSON.parse(rawPreviousCertificateDocs)

        const certificateDocs = [...newCertificateDocs, ...previousCertificateDocs]
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



export const invoiceDownload = async (req, res) => {

    try {

        const templateContent = await fsPromise.readFile(path.join("files", "course_invoice.docx"));


        // Create pizzip instance
        const zip = new Pizzip();

        // Load content into pizzip
        zip.load(templateContent)

        const doc = new Docxtemplater();
        doc.loadZip(zip);

        // Set the template data
        doc.setData(req.body);

        // Perform the template substitution
        doc.render();


        // Generate the updated content
        const updatedContent = doc.getZip().generate({ type: 'nodebuffer' });

        // Set headers for the response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=A-certificate.docx');

        // Send the generated content as the response
        res.status(200).send(updatedContent);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }

}
