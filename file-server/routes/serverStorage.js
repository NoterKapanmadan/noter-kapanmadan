import express from 'express';
import { deleteImages, deleteRequests, createRequest, saveRequest } from '../controllers/serverStorage.js';


const router = express.Router();


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



router.delete('/deleteImages', deleteImages);
router.delete('/deleteRequests', deleteRequests);
router.post('/createRequest', createRequest);
router.post('/saveRequest', saveRequest);

export default router;