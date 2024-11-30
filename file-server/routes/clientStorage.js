import express from 'express';
import multer from 'multer';

import { getBase64, getFiles, uploadBatch } from '../controllers/clientStorage.js';


const router = express.Router();
const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post('/uploadBatch', upload.array('files'), uploadBatch);
router.get('/getFiles', getFiles);
router.get('/getBase64', getBase64);

export default router;