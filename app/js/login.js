import { goTo } from "./util/navigation.js";
import { openLoadingScreen, closeLoadingScreen } from "./util/loading.js";

export function login() {
  const loginBtn = document.getElementById("login-btn");

  
  loginBtn.addEventListener("click", (event) => {
    openLoadingScreen();
  
    setTimeout(() => {
      closeLoadingScreen();

      goTo('/home');
    }, 4000);
    
  });
}
