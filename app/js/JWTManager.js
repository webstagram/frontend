const token = localStorage.getItem('jwtToken');
function decodeJWT() {
    try {
        const data = token.split('.')[1];
        const stringify = (base64UrlDecode(data));
        return JSON.parse(stringify);
    } catch (error) {
        console.log(error)
        return null;
    }

}
function isTokenExpired() {
    if (!token) return true;
    const payload = decodeJWT();
    return !payload || Date.now() >= (payload.exp * 1000) - 30000;
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


export { isTokenExpired, decodeJWT }