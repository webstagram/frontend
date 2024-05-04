export function home() {
  let searchBar = document.querySelector('#search-bar');
  searchBar.addEventListener('keyup', updateWebDisplay);
  
  let webs = {};
  let webContainers = document.querySelectorAll('.web-container');
  webContainers.forEach((webContainer, index) => {
    webs[index] = {
      title: webContainer.querySelector('.web-title'),
      username: webContainer.querySelector('.username'),
      topics: (webContainer.querySelector('.topics')),
      style: webContainer.style
    };
  });

  function updateWebDisplay() {
    let searchText = searchBar.value.toLowerCase().trim();

    Object.values(webs).forEach(web => {
      let { title, username, topics } = web;

      let titleString = title.innerText.toLowerCase().trim();
      let usernameString = username.innerText.toLowerCase().trim();
      let topicStringArray = Array.from(topics.querySelectorAll('.topic')).map(topic => topic.innerText.toLowerCase().trim());

      if (titleString.includes(searchText) || usernameString.includes(searchText) || topicStringArray.some(topicString => topicString.includes(searchText))) {
        web.style.display = 'grid';
      } else {
        web.style.display = 'none';
      }
    });
  }
}