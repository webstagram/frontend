const token = localStorage.getItem('jwtToken');
function decodeJWT() {
    try {
    const data=token.split('.')[1];
    const stringify=atob(base64UrlToBase64(data));
    return JSON.parse(stringify);
    } catch (error) {
        return null;
    }
    
}
function isTokenExpired() {
    if (!token) return true;
    const payload = decodeJWT();
    return  !payload || Date.now() >= (payload.exp * 1000) - 30000;
}
function base64UrlToBase64(input) {
    let base64String = input.replace(/-/g, '+').replace(/_/g, '/');
    let padding = 4 - (base64String.length % 4);
    if (padding !== 4) {
      for (let i = 0; i < padding; i++) {
        base64String += '=';
      }
    }
    return base64String;
  }
  
export { isTokenExpired, decodeJWT }