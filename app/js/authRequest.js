import { openAlert } from './alert.js';
import config from './configManager.js';
import {isTokenExpired, logout} from './JWTManager.js';
const backendURL=config.BACKEND_URL;



  // Function to add the JWT as a header and make the fetch request
 async function fetchWithAuth(endpoint, options = {}) {
  const token=localStorage.getItem('jwtToken');
    // Check if the token is expired
    if (await isTokenExpired()) {
      openAlert("Session expired. Please log in again.")
      logout();
    }


    const headers = new Headers(options.headers || {});
    headers.append('Authorization', `${token}`);
    let url= backendURL+endpoint;
    // Make the fetch request with the added JWT header
    let result=  await fetch(url, {
      ...options,
      headers,
    });
    if (result.status==401) { logout();}
    else return result;
  }

  export {  fetchWithAuth };
