import express from "express"
import path from 'path'
import { addCourse, allCourse, editCourse, getUpdateCourse, hideCourses } from "../controllers/courseController.js"
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
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
})
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('PDF files only!');
  }
}



router.post('/', upload.array('certificateDocs', 12), addCourse)
router.get('/', allCourse)
router.get('/:id', getUpdateCourse)
router.post('/hide-courses', hideCourses)
router.patch('/edit-course/:id', upload.array('certificateDocs', 12), editCourse)

export default router
