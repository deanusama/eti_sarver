import express from "express"
import { addStudent, allStudent, allStudentInvoices, editStudent, editStudentInvoice, getUpdateStudent, hideStudents } from "../controllers/studentController.js";

const router = express.Router()



allStudentInvoices

router.post('/', addStudent)
router.get('/', allStudent)
router.get('/student-invoices', allStudentInvoices)
router.patch('/edit-invoice/:id', editStudentInvoice)
router.get('/:id', getUpdateStudent)

router.post('/hide-students', hideStudents)
// router.post('/bulk-delete', deleteCourse)
router.patch('/edit-student/:id', editStudent)

export default router
