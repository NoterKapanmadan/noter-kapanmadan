
import fs from 'fs';
import { generateJwt, verifyJwt } from '../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';


export const createRequest = (req, res) => {
    try {
    const jwt = generateJwt({ requestId: uuidv4() });

    res.status(200).json({
        status: "Success!",
        jwt: jwt
    });

    } catch (e) {
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

