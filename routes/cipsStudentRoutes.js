import express from "express"
import { addCipsStudent, allCipsStudent, editCipsStudent, getUpdateCipsStudent, hideCipsStudent } from "../controllers/cipsStudentController.js"

const router = express.Router()




router.post('/', addCipsStudent)
router.get('/', allCipsStudent)
router.get('/:id', getUpdateCipsStudent)
router.post('/hide-cipsStudent', hideCipsStudent)
router.patch('/edit-cips-student/:id', editCipsStudent)

export default router
