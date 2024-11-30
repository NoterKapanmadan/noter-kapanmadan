
import fs from 'fs';
import { decodeJwt, generateJwt, verifyJwt } from '../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';
import { compressImage } from '../utils/compressImage.js';

export const uploadFilesDirectly = (req, res) => {


    try {
        const requestId = uuidv4();

        if (!fs.existsSync("public/")) {
            fs.mkdirSync("public/");
        }
        const filePaths = [];
        const imageIds = [];

        fs.mkdirSync(`public/${requestId}`);

        req.files.forEach((file, index) => {
            const suffix = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
            const folderPath = `public/${requestId}/${index}`;
            try {
                fs.mkdirSync(folderPath);
                fs.writeFileSync(`${folderPath}/original.${suffix}`, file.buffer);
                
                // if image compress it and create different versions
                if(file.mimetype.startsWith("image/")) {
                    compressImage(file.buffer, folderPath); //maybe await here
                }
                // file written successfully
                filePaths.push(folderPath);
                imageIds.push(`${requestId}/${index}`)
            } catch (err) {
                console.error(err);
            }
        });

        res.status(200).json({
            status: "Success!",
            filePaths: filePaths,
            imageIds: imageIds,
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
};

export const createRequest = (req, res) => {
    try {
        const jwt = generateJwt({ requestId: uuidv4() });

        res.status(200).json({
            status: "Success!",
            jwt: jwt
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
};

export const saveRequest = (req, res) => {

    const jwt = req.body.jwt;

    try {

        if (!verifyJwt(jwt)) {
            res.status(401).json({
                status: "Error!",
                message: "Invalid JWT token!"
            })
            return;
        };

        const requestId = decodeJwt(jwt).requestId;

        // Move all the the files and folders from temp to public
        fs.renameSync(`temp/${requestId}`, `public/${requestId}`);

        res.status(200).json({
            status: "Success!",
            filePaths: fs.readdirSync(`public/${requestId}`).map((filename) => `${requestId}/${filename}`)
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
};

export const deleteFiles = (req, res) => {
    const paths = req.body.paths; // without public, e.g. requestId/filename
    try {
        paths.forEach((paths) => {
            try {
                fs.rmSync(`public/${paths}`, { recursive: true });
            } catch (e) {

            }
        })
        res.status(200).json({
            status: "Success!",
        })

    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}

export const deleteRequests = (req, res) => {
    const requestIds = req.body.requestIds; // only requestIds
    try {
        requestIds.forEach((requestId) => {
            try {
                fs.rmSync(`public/${requestId}`, { recursive: true });
            } catch (e) {

            }
        })
        res.status(200).json({
            status: "Success!",
        })

    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}

