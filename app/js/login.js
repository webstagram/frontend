

export function login() {
  const loginBtn = document.getElementById("login-btn");

  loginBtn.addEventListener("click", (event) => {
    const a = document.createElement('a');
    a.href = '/home';
    a.onclick = window.route;
    a.click();
  });
}
