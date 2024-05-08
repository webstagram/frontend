const popup = document.getElementById('popup-container');
const popupContent = document.getElementById('popup-content');
const popupButton = document.getElementById('popup-button')
const rootElement = document.documentElement;


function closePopup() {
  popup.style.display = 'none';
  rootElement.classList.remove('disable-scrolling');
}

function openPopup(content, callbackFunc = undefined) {
  if (!content) return;

  rootElement.classList.add('disable-scrolling');
  popupContent.innerText = content;

  if (callbackFunc !== undefined) {
    popupButton.addEventListener('click', callbackFunc);
  } else {
    setTimeout(closePopup, 2000);
  }

  popup.style.display = 'flex';
}

export {
  openPopup,
  closePopup,
}