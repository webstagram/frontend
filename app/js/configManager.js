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
    return configData;
  } catch (error) {
    console.error('Error loading config:', error);
    return {};
  }
}
const config = await loadConfig();
export default config;