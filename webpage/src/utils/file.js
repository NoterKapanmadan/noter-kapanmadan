import { FILE_SERVER_URL, JWT_SECRET, SERVER_URL } from "./constants";

export async function getFileUploadToken() {
    const result = await fetch(`${SERVER_URL}/files/requestUploadToken`);
    const jwtData = await result.json();
    const jwt = jwtData.jwt;
    
    return jwt;
}

export async function saveFilesPublic(jwt) {
const result = await fetch(`${SERVER_URL}/files/savePublic`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jwt: jwt })
});

const data = await result.json();
return data.filePaths;

}


export async function uploadFilesServer(files) {

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${FILE_SERVER_URL}/serverStorage/uploadFilesDirectly`, {
        method: 'POST',
        headers: {
            'authentication': JWT_SECRET,
        },
        cache: 'no-cache',
        body: formData
    });
    
    const data = await response.json(); // { filePaths: [string], imageIds: [string] }
    //console.log("data", data);
    return { filePaths: data.filePaths, imageIds: data.imageIds };
    
    }

/**
 * 
 * @param {string} imageId String of imageId like '261agd-1a2d-1a2d-1a2d/1'
 * @param {'high' | 'medium_resized' | 'low'} quality The quality of the image, can be:
 *  'high' (details page),
 *  'medium_resized' (listing page),
 *  or 'low' (very small image for example for profile picture in homepage) 
 * @returns {string} The URL of the image with the specified quality
 */
    export const getImageSrc = (imageId, quality = 'high') => {
        if (!imageId) return "/avatar.png";
        if (quality === 'high') return `${FILE_SERVER_URL}/public/${imageId}/large.jpg`;
        else if (quality === 'medium_resized') return `${FILE_SERVER_URL}/public/${imageId}/medium_resized.jpg`;
        else if (quality === 'low') return `${FILE_SERVER_URL}/public/${imageId}/small.jpg`;
        else return `${FILE_SERVER_URL}/public/${imageId}/large.jpg`;
    }

    export const extractImagesFromAds = async (rawAds) => {
        let ads;
        ads = rawAds.map((ad) => {
            return {
                ...ad,
                images: ad.images ? ad.images.split(',') : null
            }
        });

        const base64Images = await fetch(`${FILE_SERVER_URL}/clientStorage/getBase64?files=${JSON.stringify(
            ads.map((ad) => ad.images ? ad.images[0] : null)
        )}` );
        const base64ImagesData = await base64Images.json();

        ads = ads.map((ad) => {
            return {
                ...ad,
                base64Image: ad.images ? base64ImagesData.map[ad.images[0]] : null,
            }
        });

        return ads;
    };

    export const extractImagesFromAd = async (rawAd) => {
        let ad;
        ad = {
            ...rawAd,
            images: rawAd.images ? rawAd.images.split(',') : null
        };

        const base64Images = await fetch(`${FILE_SERVER_URL}/clientStorage/getBase64Original?files=${JSON.stringify(
            ad.images ? ad.images : null,
        )}`, {
            cache: 'no-cache',
        } ); // maybe no cache can be removed
        const base64ImagesData = await base64Images.json();
        //console.log("base64", base64ImagesData);
        ad = {
            ...ad,
            base64Images: ad.images ? ad.images.map((image) => base64ImagesData.map[image]) : null,
            dimensions: ad.images ? ad.images.map((image) => base64ImagesData.dimensionsMap[image]) : null,
        };

        return ad;
    }
