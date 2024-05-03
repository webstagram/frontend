
function goTo(path) {
  if (!path || typeof(path) !== 'string' || path[0] !== '/') return;

  const a = document.createElement('a');
  a.href = `#${path}`;
  a.onclick = window.route;
  a.click();
}

function back() {
  window.history.back();
}

export {
  goTo,
  back
}