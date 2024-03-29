import express from "express"
import { addStudent, allStudent, allStudentInvoices, certificateDownload, editStudent, editStudentInvoice, getUpdateStudent, hideStudents, invoiceDownload } from "../controllers/studentController.js";

const router = express.Router()

router.post('/', addStudent)
router.get('/', allStudent)
router.get('/student-invoices', allStudentInvoices)
router.patch('/edit-invoice/:id', editStudentInvoice)
router.get('/:id', getUpdateStudent)

router.post('/hide-students', hideStudents)
// router.post('/bulk-delete', deleteCourse)
router.patch('/edit-student/:id', editStudent)


router.post('/invoice', invoiceDownload)
router.post('/certificate', certificateDownload)

export default router
