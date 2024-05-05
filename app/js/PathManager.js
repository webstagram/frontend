export function routeWithoutRefresh(path) {
    const a = document.createElement('a');
    a.href = path;
    a.onclick = window.route;
    a.click();
}
export function routeButton(buttonId, path = "/") {
    const button = document.getElementById(buttonId);
    button.style.cursor='pointer';
    button.addEventListener("click", (event) => {
        routeWithoutRefresh(path);
    });
}