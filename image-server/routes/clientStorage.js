import express from 'express';
import multer from 'multer';

import { getImages, uploadBatch, uploadOne } from '../controllers/clientStorage.js';


const router = express.Router();
const upload = multer();

router.put('/uploadOne', upload.single('image'), uploadOne);
router.put('/uploadBatch', upload.array('images'), uploadBatch);
router.get('/getImages', getImages);

export default router;