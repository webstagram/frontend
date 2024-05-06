const alertBox = document.getElementById('alert');
const alertContent = document.getElementById('alert-content')

const serverity = {
  success: '#418944',
  info: '#1893d5',
  warning: '#ffbd18',
  error: '#d74242',
}

function openAlert(message, error = serverity['error']) {
  if (!message) return;

  alertContent.innerText = message;
  alertBox.style.background = serverity[error] || serverity['error'];
  alertBox.style.display = 'grid'

  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 3000);
}

export {
  openAlert
}