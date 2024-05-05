
import config from './configManager.js';
import {isTokenExpired} from './JWTManager.js';

export function login() {
  if (!isTokenExpired()) {
    window.location.href = "/?path=home";
  }

  const loginBtn = document.getElementById("login-btn");

  loginBtn.addEventListener("click", (event) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_CLIENT_ID}`;
    window.location.href = githubAuthUrl;
  });
}
