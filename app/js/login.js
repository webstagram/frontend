
import config from './configManager.js';
export function login() {
  const loginBtn = document.getElementById("login-btn");

  loginBtn.addEventListener("click", (event) => {
    // GitHub's OAuth authorization endpoint
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_CLIENT_ID}`;
  
    // Redirect to GitHub's OAuth login page
    window.location.href = githubAuthUrl;
  });
}
