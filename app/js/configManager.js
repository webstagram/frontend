const hostname = window.location.hostname;
let configFile;
if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    configFile = "../dev.config.json";
}
else {
    configFile = "../prod.config.json";
}
async function loadConfig() {
    try {
      const response = await fetch(configFile);
      const configData = await response.json();
      return configData; // Returns the parsed configuration object
    } catch (error) {
      console.error('Error loading config:', error);
      return {}; // Returns an empty object in case of an error
    }
  }
  const config = await loadConfig();
  export default config;