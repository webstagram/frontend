import config from './configManager.js';
import {isTokenExpired} from './JWTManager.js';
const backendURL=config.BACKEND_URL;
const token=localStorage.getItem('jwtToken');


  // Function to add the JWT as a header and make the fetch request
 async function fetchWithAuth(endpoint, options = {}) {
    // Check if the token is expired
    debugger;
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

  export {  fetchWithAuth };
