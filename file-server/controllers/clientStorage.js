
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
            const filename = `${index}.${suffix}`
            try {
                fs.writeFileSync(`temp/${requestId}/${filename}`, file.buffer);
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

// ?images=["sag23t-3525wt-/0","sag23t-3525wt-/1"]
export const getImages = (req, res) => {
    
    try {
        const images = JSON.parse(req.query.images);

        const paths = images.map((imagePath) => {
            const files = fs.readdirSync(`public/${imagePath}`);
            return files.map((filename) => `/public/${imagePath}/${filename}`);
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