import { SERVER_URL } from "./constants";

export async function getImageUploadToken() {
    const result = await fetch(`${SERVER_URL}/images/requestUploadToken`);
    const jwtData = await result.json();
    const jwt = jwtData.jwt;
    
    return jwt;
}

export async function saveImagesPublic(jwt) {
const result = await fetch(`${SERVER_URL}/images/savePublic`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jwt: jwt })
});

const data = await result.json();

return data.path;

}