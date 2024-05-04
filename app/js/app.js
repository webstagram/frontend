import { login } from "./login.js";
import { home } from "./home.js";
import { web } from "./web.js";

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  handleLocation();
};

const routes = {
  404: {
    'template': '/pages/404.html',
    'js': (str) => console.log(str)
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
    'js': (str) => console.log(str)
  },
  'web': {
    'template': '/pages/web.html',
    'js': web,
  },
  'index.html' :{
    'template': '/pages/login.html',
    'js': login
  }
};

const handleLocation = async () => {
  // const path = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);

// Get the parameter value
  let path = urlParams.get('path'); // Replace 'param' with your parameter name
  if(!path)path='';
  const route = (!!routes[path] && routes[path].template) || routes[404].template;
  const html = await fetch(route).then((data) => data.text());
  document.getElementById('main-page').innerHTML = html;
  routes[path].js(path);
};


const addClickEventToNavItems = () => {
  const mainNav = document.getElementById('main-nav');
  const children = mainNav.children;
  for (let i = 0; i < children.length; i++) {
    children[i].addEventListener('click', route);
  }
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
addClickEventToNavItems();