import { SERVER_URL } from "./constants";

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

return data.path;

}