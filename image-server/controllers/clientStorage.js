
import fs from 'fs';
import { verifyJwt } from '../utils/jwt.js';
import { decode } from 'punycode';

//image and filename in request
export const uploadOne = (req, res) => {

    try {

        if (!verifyJwt(jwtToken)) {
            res.status(401).json({
                status: "Error!",
                message: "Invalid JWT token!"
            })
            return;
        }

        const requestId = decode(jwtToken).requestId;

        if (!fs.existsSync("public/")) {
            fs.mkdirSync("public/");
        }

        if (!fs.existsSync(`public/${requestId}`)) {
            fs.rmSync(`public/${requestId}`, { recursive: true });
            fs.mkdirSync(`public/${requestId}`);
        }


        const suffix = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1)
        const filename = `0.${suffix}`

        try {
            fs.writeFileSync(`public/${filename}`, req.file.buffer);
            // file written successfully
        } catch (err) {
            console.error(err);
        }
        res.status(200).json({
            status: "Success!",
            filename: filename,
            path: `/public/${requestId}/${filename}`
        })
    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}


export const uploadBatch = (req, res) => {
    const jwtToken = req.headers["jwt"];
    try {
        if (!verifyJwt(jwtToken)) {
            res.status(401).json({
                status: "Error!",
                message: "Invalid JWT token!"
            })
            return;
        }

        const requestId = decode(jwtToken).requestId;

        if (!fs.existsSync("public/")) {
            fs.mkdirSync("public/");
        }
        const filenames = [];
        const paths = [];

        if (!fs.existsSync(`public/${requestId}`)) {
            fs.rmSync(`public/${requestId}`, { recursive: true });
            fs.mkdirSync(`public/${requestId}`);
        }

        req.files.forEach((file, index) => {
            const suffix = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
            const filename = `${index}.${suffix}`
            try {
                fs.writeFileSync(`public/${requestId}/${filename}`, file.buffer);
                // file written successfully
                filenames.push(filename);
                paths.push(`/public/${requestId}/${filename}`);
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
            return `${requestId}/${filename}`;
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