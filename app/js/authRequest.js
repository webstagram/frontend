import config from './configManager.js';
const backendURL=config.BACKEND_URL;
const token=localStorage.getItem('jwtToken');

function isTokenExpired() {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= (payload.exp * 1000)-30000;
  }

  // Function to add the JWT as a header and make the fetch request
 async function fetchWithAuth(endpoint, options = {}) {
    // Check if the token is expired
    if (isTokenExpired()) {
      console.error('Token is expired');
      // Handle token expiration, e.g., refresh the token or redirect to login
      return Promise.reject('Token is expired');
    }


    const headers = new Headers(options.headers || {});
    headers.append('Authorization', `${token}`);
    let url= backendURL+endpoint;
    // Make the fetch request with the added JWT header
    return  await fetch(url, {
      ...options,
      headers,
    });
  }

  export { isTokenExpired, fetchWithAuth };

