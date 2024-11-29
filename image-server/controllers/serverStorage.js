
import fs from 'fs';
import { decodeJwt, generateJwt, verifyJwt } from '../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';


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
    console.log("save request", jwt);
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
            path: `/public/${requestId}`,
            imagePaths: fs.readdirSync(`public/${requestId}`).map((filename) => `/public/${requestId}/${filename}`)
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
};

export const deleteImages = (req, res) => {
    const paths = req.body.paths; // without public, e.g. requestId/filename
    try {
        paths.forEach((paths) => {
            try {
                fs.rmSync(`public/${paths}`);
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

