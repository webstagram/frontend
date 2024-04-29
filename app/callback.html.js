const queryString = window.location.search;
const backendURL="http://localhost:5000/";

// Use URLSearchParams to parse the query string
const urlParams = new URLSearchParams(queryString);

// Get the parameter value
const paramValue = urlParams.get('code'); // Replace 'param' with your parameter name

// Print the parameter value in the body of the HTML page
async function fetchResponse() {
    try {
      let response = await fetch(`${backendURL}github/callback?code=${paramValue}`);
     response = await response.json(); // Make sure to await the .json() call as well
      console.log(response);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }
  
  // Call the async function
  fetchResponse();