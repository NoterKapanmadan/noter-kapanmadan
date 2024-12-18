import sharp from 'sharp';
import fs from 'fs';

const SMALL_RESIZE_HEIGHT = 100;
const MEDIUM_RESIZE_HEIGHT = 500;
const LARGE_RESIZE_HEIGHT = 1440;

const ASPECT_RATIO = 1.33;
const FIT_MODE = 'cover'; // it might be contain (add black or white padding) or cover(remove some parts). Both keep aspect ratio

export async function compressImage(fileBuffer, folderPath, resizeAspectRatio = ASPECT_RATIO) {

    const image = sharp(fileBuffer, { sequentialRead: true, failOn: 'none' });
    const metadata = await image.metadata();
    const { width, height } = metadata;
    const aspectRatio = width / height;

    // Image for listing page, aspect ratio according to card size
    await image
        .resize({ height: MEDIUM_RESIZE_HEIGHT, width: Math.floor(MEDIUM_RESIZE_HEIGHT * resizeAspectRatio), fit: FIT_MODE })
        .jpeg({ quality: 70, progressive: true })
        .toFile(`${folderPath}/medium_resized.jpg`)

    // Image for detail page which keeps original image's aspect ratio
    await image
        .resize(height > LARGE_RESIZE_HEIGHT ?
            { height: LARGE_RESIZE_HEIGHT, width: Math.floor(LARGE_RESIZE_HEIGHT * aspectRatio) }
            : { height, width }
        )
        .jpeg({ quality: 90, progressive: true })
        .toFile(`${folderPath}/large.jpg`)

    // Image for maybe profile picture when is small, aspect ratio according to card size
    await image
        .resize(height > SMALL_RESIZE_HEIGHT ?
            { height: SMALL_RESIZE_HEIGHT, width: Math.floor(SMALL_RESIZE_HEIGHT * aspectRatio) }
            : { height, width }
        )
        .jpeg({ quality: 65, progressive: true })
        .toFile(`${folderPath}/small.jpg`)

    // Base64 image for blur for medium image
    const resizedBase64 = await image
        .resize({height: 10, width: Math.floor(10 * resizeAspectRatio), fit: FIT_MODE})
        .jpeg({ quality: 30 })
        .toBuffer()

    const originalBase64 = await image
        .resize({height: 10, width: Math.floor(10 * aspectRatio)})
        .jpeg({ quality: 30 })
        .toBuffer()

    fs.writeFileSync(`${folderPath}/resizedBase64`, `data:image/jpeg;base64,${resizedBase64.toString('base64')}`, 'utf8');
    fs.writeFileSync(`${folderPath}/originalBase64`, `data:image/jpeg;base64,${originalBase64.toString('base64')}`, 'utf8');

    return true;
}