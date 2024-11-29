
import fs from 'fs';
import { decodeJwt, verifyJwt } from '../utils/jwt.js';


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

        if (fs.existsSync(`temp/${requestId}`)) {
            fs.rmSync(`temp/${requestId}`, { recursive: true });
        }

        fs.mkdirSync(`temp/${requestId}`);

        req.files.forEach((file, index) => {
            const suffix = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
            const filename = `original.${suffix}`
            try {
                fs.mkdirSync(`temp/${requestId}/${index}`);
                fs.writeFileSync(`temp/${requestId}/${index}/${filename}`, file.buffer);
                // file written successfully
                filenames.push(filename);
            } catch (err) {
                console.error(err);
            }
        });

        res.status(200).json({
            status: "Success!",
            filenames: filenames,
        })

    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}

// also add get image to get blurred version etc????, or just use the same endpoint, or all of them will have same naming convention

// ?files=["sag23t-3525wt-/0","sag23t-3525wt-/1"]
export const getFiles = (req, res) => {
    
    try {
        const files = JSON.parse(req.query.files);

        const paths = files.map((filePath) => {
            // Show only files in the folder
            let files;
            try {
            files = fs.readdirSync(`public/${filePath}`).filter((filename) => fs.lstatSync(`public/${filePath}/${filename}`).isFile());
            } catch (e) {
                return [];
            }
            return files.map((filename) => `/public/${filePath}/${filename}`);
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