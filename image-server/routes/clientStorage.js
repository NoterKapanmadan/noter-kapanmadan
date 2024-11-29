import express from 'express';
import multer from 'multer';

import { getImages, uploadBatch } from '../controllers/clientStorage.js';


const router = express.Router();
const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post('/uploadBatch', upload.array('images'), uploadBatch);
router.get('/getImages', getImages);

export default router;