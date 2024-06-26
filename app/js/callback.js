const queryString = window.location.search;
import config from './configManager.js';
const backendURL = config.BACKEND_URL;
const urlParams = new URLSearchParams(queryString);
const paramValue = urlParams.get('code'); 

async function fetchResponse() {
  try {
    let response = await fetch(`${backendURL}github/callback?code=${paramValue}`);
    response = await response.json();
    localStorage.setItem('jwtToken', response.jwt);
    localStorage.setItem('refreshToken',response.refresh);
  } catch (error) {
    window.location.href='/?path=home';
  }
}
  
(async () => {
  try {
    await fetchResponse();
    window.location.href='/?path=home';
  
  } catch (error) {
  }
})();
