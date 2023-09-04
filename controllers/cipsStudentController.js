import { StatusCodes } from "http-status-codes";
import CipsStudent from "../model/cipsStudentModel.js";



import fsPromise from 'fs/promises';
// import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
// import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
import Pizzip from 'pizzip';



export const addCipsStudent = async (req, res) => {

    const { files, body: { examDetail: examDetailRaw, ...rest } } = req

    try {
        const cipsDocs = files.map((file) => ({ name: file.originalname, documentURL: file.path }))
        const examDetail = JSON.parse(examDetailRaw)

        const cipsStudent = await CipsStudent.create({
            ...rest, cipsDocs, examDetail
        });

        res.status(StatusCodes.CREATED).json({ cipsStudent })

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to add student", msg: error.message })

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
    const { files, body: { examDetail: examDetailRaw, previousCipsDocs: rawPreviousCipsDocs, cipsDocs: _, ...rest } } = req

    try {
        const previousCipsDocs = JSON.parse(rawPreviousCipsDocs)
        const newCipsDocs = files.map((file) => ({ name: file.originalname, documentURL: file.path }))


        const examDetail = JSON.parse(examDetailRaw)
        const cipsDocs = [...previousCipsDocs, ...newCipsDocs]


        const cipsStudent = await CipsStudent.findOne({ _id: id })
        if (!cipsStudent) {
            throw new Error(`No Cips Student with with ID ${id}`)
        }

        const updatedCipsStudent = await CipsStudent.findOneAndUpdate(
            { _id: id },

            { ...rest, examDetail, cipsDocs },
            { new: true, runValidators: true })


        res.status(StatusCodes.OK).json({ updatedCipsStudent })

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to update Cips Student', message: error.message })
    }
}




export const invoiceDownload = async (req, res) => {

    try {

        const templateContent = await fsPromise.readFile(path.join("files", "cips_student_invoice.docx"));

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