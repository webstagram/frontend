
import config from './configManager.js';

export function login() {
  // let retried = urlParams.get('error');

  const loginBtn = document.getElementById("login-btn");

  loginBtn.addEventListener("click", (event) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_CLIENT_ID}`;
    window.location.href = githubAuthUrl;
  });
}
