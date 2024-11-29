import express from 'express';
import multer from 'multer';

import { getImages, uploadBatch, uploadOne } from '../controllers/clientStorage.js';


const router = express.Router();
const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post('/uploadOne', upload.single('image'), uploadOne);
router.post('/uploadBatch', upload.array('images'), uploadBatch);
router.get('/getImages/:requestId', getImages);

export default router;