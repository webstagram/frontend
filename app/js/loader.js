const loader = document.getElementById('loader');

function openLoader() {
  loader.style.display = 'grid';
}

function closeLoader() {
  loader.style.display = 'none';
}

export {
  openLoader,
  closeLoader
}
