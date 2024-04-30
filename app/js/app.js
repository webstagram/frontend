import { login } from "./login.js";
import { home } from "./home.js";

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
  '/': {
    'template': 'pages/login.html',
    'js': login
  },
  '/home': {
    'template': '/pages/home.html',
    'js': home,
  },
  '/about': {
    'template': '/pages/about.html',
    'js': (str) => console.log(str)
  }
};

const handleLocation = async () => {
  const path = window.location.pathname;
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