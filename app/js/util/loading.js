
const loadingScreen = document.getElementById("loading-screen");

function openLoadingScreen() {
  loadingScreen.style.display = 'grid';
}

function closeLoadingScreen() {
  loadingScreen.style.display = 'none';
}

export {
  openLoadingScreen,
  closeLoadingScreen,
}