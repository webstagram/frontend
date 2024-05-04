const token=localStorage.getItem('jwtToken');
function decodeJWT(){
    return JSON.parse(atob(token.split('.')[1]));
}
function isTokenExpired() {
    if(!token) return true;
    const payload = decodeJWT();
    return Date.now() >= (payload.exp * 1000)-30000;
  }

export {isTokenExpired, decodeJWT}