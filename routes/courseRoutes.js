import express from "express"
import path from 'path'
import { addCourse, allCourse, editCourse, getUpdateCourse, hideCourses, invoiceDownload } from "../controllers/courseController.js"
import multer from "multer";

const router = express.Router()


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './uploads/course',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Math.random().toString(36).slice(2, 8) + path.extname(file.originalname));
  }
});
// Init Upload
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf" || file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg .jpeg .pdf and .docx format allowed!'));
    }
  }
})


router.post('/', addCourse)
router.get('/', allCourse)
router.get('/:id', getUpdateCourse)
router.post('/hide-courses', hideCourses)
router.patch('/edit-course/:id', editCourse)

router.post('/invoice', invoiceDownload)


export default router

