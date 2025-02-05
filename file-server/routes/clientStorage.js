import express from 'express';
import multer from 'multer';

import { getBase64, getBase64Original, getFiles, uploadBatch } from '../controllers/clientStorage.js';


const router = express.Router();
const upload = multer({
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

router.post('/uploadBatch', upload.array('files'), uploadBatch);
router.get('/getFiles', getFiles);
router.get('/getBase64', getBase64);
router.get('/getBase64Original', getBase64Original);

export default router;