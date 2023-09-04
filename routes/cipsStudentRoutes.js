import express from "express"
import { addCipsStudent, allCipsStudent, editCipsStudent, getUpdateCipsStudent, hideCipsStudent, invoiceDownload }from "../controllers/cipsStudentController.js"
import path from 'path'
import multer from "multer";

const router = express.Router()


// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './uploads/cips',
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


router.post('/', upload.array("cipsDocs", 12), addCipsStudent)
router.get('/', allCipsStudent)
router.get('/:id', getUpdateCipsStudent)
router.post('/hide-cipsStudent', hideCipsStudent)
router.patch('/edit-cips-student/:id', upload.array("cipsDocs", 12), editCipsStudent)


router.post('/invoice', invoiceDownload)
 

export default router
