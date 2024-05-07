const loader = document.getElementById('loader');
const rootElement = document.documentElement;

function openLoader() {
  rootElement.classList.add('disable-scrolling');
  loader.style.display = 'flex';
}

function closeLoader() {
  rootElement.classList.remove('disable-scrolling');
  loader.style.display = 'none';
}

export {
  openLoader,
  closeLoader
}
