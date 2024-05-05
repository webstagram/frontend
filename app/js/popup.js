const popup = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupButton = document.getElementById('popup-button')


function closePopup() {
  popup.style.display = 'none';
}

function openPopup(content, callbackFunc = undefined) {
  if (!content) return;

  popupContent.innerText = content

  if (callbackFunc !== undefined) {
    popupButton.addEventListener('click', callbackFunc);
  } else {
    setTimeout(closePopup, 2000);
  }

  popup.style.display = 'grid';
}

export {
  openPopup,
  closePopup,
}