import config from './configManager.js';
const backendURL = config.BACKEND_URL;
import { routeWithoutRefresh } from './PathManager.js';

function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    routeWithoutRefresh('/');
}

function decodeJWT(token = localStorage.getItem('jwtToken')) {
    try {
        const data = token.split('.')[1];
        const stringify = (base64UrlDecode(data));
        return JSON.parse(stringify);
    } catch (error) {
        console.log(error)
        return null;
    }

}
async function isTokenExpired() {
    const refresh = localStorage.getItem('refreshToken')
    let jwt = localStorage.getItem('jwtToken');
    const jwtvalid = isTokenValid(jwt);
    if (jwtvalid) return false;
    else if (!jwtvalid && isTokenValid(refresh)) {
        const headers = new Headers({});
        headers.append('Authorization', `${refresh}`);
        let url = backendURL + "refresh";
        let result = await fetch(url, {

            headers
        });
        if (!result.ok) return true;
        result = await result.json();
        localStorage.setItem('jwtToken', result.jwt);
        return false;
    }
    return true;
}
function isTokenValid(token) {
    if (!token) return false;
    const payload = decodeJWT(token);
    return !(!payload || Date.now() >= (payload.exp * 1000) - 30000);
}
function base64UrlDecode(input) { //required as atob only works with ASCII characters
    let base64String = input.replace(/-/g, '+').replace(/_/g, '/');
    let padding = 4 - (base64String.length % 4);
    if (padding !== 4) {
        for (let i = 0; i < padding; i++) {
            base64String += '=';
        }
    }
    const decodedData = atob(base64String);
    const decodedString = decodeURIComponent(Array.from(decodedData).map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return decodedString;
}


export { isTokenExpired, decodeJWT, logout }