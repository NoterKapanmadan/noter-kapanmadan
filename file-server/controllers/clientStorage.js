
import fs from 'fs';

import { decodeJwt, verifyJwt } from '../utils/jwt.js';
import { compressImage } from '../utils/compressImage.js';
import { getImageDimensionsSync } from '../utils/dimensions.js';


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
            try {
                const folderPath = `temp/${requestId}/${index}`;
                fs.mkdirSync(folderPath);
                fs.writeFileSync(`${folderPath}/original.${suffix}`, file.buffer);
                
                
                // if image compress it and create different versions
                if(file.mimetype.startsWith("image/")) {
                    compressImage(file.buffer, folderPath);
                }
                // file written successfully
                filenames.push(file.originalname);
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

export const getBase64 = (req, res) => {
    
    try {
        const files = JSON.parse(req.query.files);

        const base64Map = {};
    
        files.forEach((filePath) => {

            try {
            const data = fs.readFileSync(`public/${filePath}/resizedBase64`, 'utf8');
                base64Map[filePath] = data;
            } catch (e) {
                base64Map[filePath] = null;
            }

        });
        res.status(200).json({
            status: "Success!",
            map: base64Map
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}

export const getBase64Original = async (req, res) => {
    
    try {
        const files = JSON.parse(req.query.files);

        const base64Map = {};
        const dimensions = {};
    
       for (const filePath of files) {

            try {
            const data = fs.readFileSync(`public/${filePath}/originalBase64`, 'utf8');
                base64Map[filePath] = data;
                dimensions[filePath] = await getImageDimensionsSync(data);
            } catch (e) {
                base64Map[filePath] = null;
                dimensions[filePath] = null;
            }
        }
    
        res.status(200).json({
            status: "Success!",
            map: base64Map,
            dimensionsMap: dimensions
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
}