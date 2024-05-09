import { login } from "./login.js";
import { home } from "./home.js";
import { isTokenExpired, decodeJWT, logout } from "./JWTManager.js";
import { web } from "./web.js";
import { add_web } from "./add_web.js";
import { closePopup } from "./popup.js";
import { routeButton } from "./PathManager.js";

let logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", (event) => {
      logout();
      logoutBtn.style.display="none";
});

const dropdownBtn = document.getElementById("webstagram-logo");
const dropdownContent = document.getElementById("nav-dropdown-content");

dropdownBtn.addEventListener("click", (event) => {
  if (dropdownContent.classList.contains("hidden")) {
    dropdownContent.classList.remove("hidden");
  } else {
    dropdownContent.classList.add("hidden");
  }
});

document.addEventListener("click", (event) => {
  if (!dropdownContent.contains(event.target) && event.target !== dropdownBtn) {
    dropdownContent.classList.add("hidden");
  }
});

dropdownContent.addEventListener("click", (event) => {
  dropdownContent.classList.add("hidden");
});

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  handleLocation();
};

const routes = {
  404: {
    'template': '/pages/404.html',
    'js': () => {}
  },
  '': {
    'template': '/pages/login.html',
    'js': login
  },
  'home': {
    'template': '/pages/home.html',
    'js': home,
  },
  'about': {
    'template': '/pages/about.html',
    'js': () => {}
  },
  'web': {
    'template': '/pages/web.html',
    'js': web,
  },
  'create': {
    'template': '/pages/add_web.html',
    'js': add_web,
  },
  'index.html' :{
    'template': '/pages/login.html',
    'js': login
  }
};

const handleLocation = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  let path = urlParams.get('path');
  if(!path)path='';
  const tokenExpired=await isTokenExpired();
  if(!tokenExpired && path===''){
    path='home';
  }
  else if(tokenExpired&& !(path==='about')){
    populateNavBar();
    path='';
  }
  if(!tokenExpired && document.getElementById("logout-btn").classList.contains("hidden")){
    document.getElementById("logout-btn").classList.remove("hidden");
  }
  const route = (!!routes[path] && routes[path].template) || routes[404].template;
  const html = await fetch(route).then((data) => data.text());
  document.getElementById('main-page').innerHTML = html;
  routes[path].js(path);
};

window.onpopstate = handleLocation;
window.route = route;

const populateNavBar = async () => {
  const userName = document.getElementById("username");
  const userProfile = document.getElementById("main-profile-image");
  const tokenExpired = await isTokenExpired();
  if (!tokenExpired) {
    const JWTJSON = decodeJWT();
    userProfile.src = JWTJSON.userImage;
    userName.textContent = JWTJSON.userName;
    userProfile.style.display = 'grid';
    userName.style.display = 'grid';
    routeButton("username", `/?search=${JWTJSON.userName}`);
    routeButton("main-profile-image", `/?search=${JWTJSON.userName}`);
  }
  else {
    userProfile.style.display = 'none';
    userName.style.display = 'none';
  }

}

routeButton("title");
routeButton("about-btn", "/?path=about");
populateNavBar();
handleLocation();
closePopup();
