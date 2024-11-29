
import fs from 'fs';
import { decodeJwt, verifyJwt } from '../utils/jwt.js';

//image and filename in request
export const uploadOne = (req, res) => {
    const jwtToken = req.body.jwt;
    try {

        if (!verifyJwt(jwtToken)) {
            res.status(401).json({
                status: "Error!",
                message: "Invalid JWT token!"
            })
            return;
        }

        const requestId = decodeJwt(jwtToken).requestId;

        if (!fs.existsSync("temp/")) {
            fs.mkdirSync("temp/");
        }

        if (fs.existsSync(`temp/${requestId}`)) {
            fs.rmSync(`temp/${requestId}`, { recursive: true });
        }

        fs.mkdirSync(`temp/${requestId}`);


        const suffix = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1)
        const filename = `0.${suffix}`

        try {
            fs.writeFileSync(`temp/${filename}`, req.file.buffer);
            // file written successfully
        } catch (err) {
            console.error(err);
        }
        res.status(200).json({
            status: "Success!",
            filename: filename,
            path: `/temp/${requestId}/${filename}`
        })
    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}


export const uploadBatch = (req, res) => {
    const jwtToken = req.body.jwt;
    try {
        if (!verifyJwt(jwtToken)) {
            res.status(401).json({
                status: "Error!",
                message: "Invalid JWT token!"
            })
            return;
        }

        const requestId = decodeJwt(jwtToken).requestId;

        if (!fs.existsSync("temp/")) {
            fs.mkdirSync("temp/");
        }
        const filenames = [];
        const paths = [];

        if (fs.existsSync(`temp/${requestId}`)) {
            fs.rmSync(`temp/${requestId}`, { recursive: true });
        }

        fs.mkdirSync(`temp/${requestId}`);

        req.files.forEach((file, index) => {
            const suffix = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
            const filename = `${index}.${suffix}`
            try {
                fs.writeFileSync(`temp/${requestId}/${filename}`, file.buffer);
                // file written successfully
                filenames.push(filename);
                paths.push(`/temp/${requestId}/${filename}`);
            } catch (err) {
                console.error(err);
            }
        });

        res.status(200).json({
            status: "Success!",
            filenames: filenames,
            paths: paths
        })

    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}

export const getImages = (req, res) => {
    const requestId = req.params.requestId;
    try {
        const files = fs.readdirSync(`public/${requestId}`);
        const paths = files.map((filename) => {
            return `/public/${requestId}/${filename}`;
        });
        res.status(200).json({
            status: "Success!",
            paths: paths
        })
    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}