import express from 'express';
import { deleteFiles, deleteRequests, createRequest, saveRequest, uploadFilesDirectly } from '../controllers/serverStorage.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

//Authentication token middleware
router.use('/', (req, res, next) => {

    if (req.headers["authentication"] === process.env.JWT_SECRET) {
        next()
    }
    else res.status(401).json({
        message: "Wrong authentication token!",
        status: "Error!"
    })
});


router.post('/uploadFilesDirectly', upload.array('files'), uploadFilesDirectly);
router.delete('/deleteFiles', deleteFiles);
router.delete('/deleteRequests', deleteRequests);
router.post('/createRequest', createRequest);
router.post('/saveRequest', saveRequest);

export default router;