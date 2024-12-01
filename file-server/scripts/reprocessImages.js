import fs from 'fs';
import { compressImage } from '../utils/compressImage.js';
import { fileTypeFromBuffer} from 'file-type';

function isNumber(value) {
    return !isNaN(value) && value.trim() !== "";
}

async function reprocessImages() {
    const requests = fs.readdirSync('public');


    for (const request of requests) {
        
        if(!fs.statSync(`public/${request}`).isDirectory()) continue;

        const imageFolders = fs.readdirSync(`public/${request}`);
        let isTrulyFormatted = true;
        for (const imageFolder of imageFolders) {
            if (!fs.statSync(`public/${request}/${imageFolder}`).isDirectory() || !isNumber(imageFolder)) {
                isTrulyFormatted = false;
                break;
            };
        }
        if(!isTrulyFormatted) continue;

        for (const imageFolder of imageFolders) {
            const files = fs.readdirSync(`public/${request}/${imageFolder}`);
            let originalFile = null

            for (const file of files) {
                if(file.startsWith('original.')) {
                    originalFile = file;
                }
            }

            if(!originalFile) continue;

            console.log(`public/${request}/${imageFolder}/${originalFile}`);
            const fileBuffer = fs.readFileSync(`public/${request}/${imageFolder}/${originalFile}`);

            const type = await fileTypeFromBuffer(fileBuffer);
            if(!type || !type.mime.startsWith('image/')) continue;

            await compressImage(fileBuffer, `public/${request}/${imageFolder}`);
        }
    }


}

reprocessImages();