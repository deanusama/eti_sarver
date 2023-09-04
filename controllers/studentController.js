import { StatusCodes } from "http-status-codes";
import Student from "../model/studentModel.js";
import Invoice from "../model/invoiceModel.js";



import fsPromise from 'fs/promises';
// import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
// import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
import Pizzip from 'pizzip';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);





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
            $set: { hide: true } // The fields and values you want to update
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

    const { hideStudent, courseId, createdAt, updatedAt, __v, id: _, _id, ...rest } = req.body

    const id = req.params.id

    try {
        const student = await Student.findOne({ _id: id })


        if (!student) {
            throw new Error(`No course with with ID ${id}`)
        }

        const updatedStudent = await Student.findOneAndUpdate({ _id: id }
            , { $set: { ...rest } },
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


export const certificateDownload = async (req, res) => {
    const { certificateType, ...invoiceData } = req.body

    try {

        let templateContent;

        switch (certificateType) {
            case "A":
            case "E":
            case "M":
                // Load the template
                templateContent = await fsPromise.readFile(path.join("files", `${certificateType}-certificate.docx`));
                break;

            default:
                throw new Error(`Unknown certificate type: ${certificateType}`);
        }

        // Create pizzip instance
        const zip = new Pizzip();

        // Load content into pizzip
        zip.load(templateContent)

        const doc = new Docxtemplater();
        doc.loadZip(zip);

        // Set the template data
        doc.setData(invoiceData);

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


export const invoiceDownload = async (req, res) => {

    try {

        const templateContent = await fsPromise.readFile(path.join("files", "student_invoice.docx"));


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