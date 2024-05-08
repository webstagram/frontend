import { routeWithoutRefresh, routeButton } from "./PathManager.js";
import { fetchWithAuth } from "./authRequest.js";
import { openLoader, closeLoader } from "./loader.js";

export async function home() {
  await getWebs();
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
  const urlParams = new URLSearchParams(window.location.search);
  let searchParams = urlParams.get('search');
  if(search){
    searchBar.value = searchParams;
    updateWebDisplay();
  }


  async function getWebs(){
    openLoader();
    var result=await fetchWithAuth('webs');
    result=await result.json();
    
    populateWebs(result);
    closeLoader();
  };

  function populateWebs(websData) {
    const container = document.getElementById('webs');
    container.innerHTML="";
    websData.forEach(web => {
      const webContainer = document.createElement('section');
      webContainer.className = 'web-container';
      webContainer.id=web.WebId;
      webContainer.addEventListener('click', function(event){
        routeWithoutRefresh(`/?path=web&webid=${webContainer.id}`);
      });
  
      const profileImage = document.createElement('img');
      profileImage.className = 'profile-image';
      profileImage.src = web.ProfileImageUrl;

      const webTitlesDiv = document.createElement('div');
      webTitlesDiv.className = 'web-titles';

      const webTitle = document.createElement('h1');
      webTitle.className = 'web-title';
      webTitle.textContent = web.WebName;

      const username = document.createElement('h2');
      username.className = 'username';
      username.textContent = web.UserName;
      username.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        searchBar.value = username.textContent;
        updateWebDisplay();
      });
      profileImage.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        searchBar.value = username.textContent;
        updateWebDisplay();
      });


      const likeIcon = document.createElement('img');
      likeIcon.className = 'like-icon';
      likeIcon.src = 'https://webstagram-backend-photo-bucket.s3.eu-west-1.amazonaws.com/icons/like.svg';
  
      const topicsDiv = document.createElement('div');
      topicsDiv.className = 'topics';
  
      // Split the topics string into an array and create an element for each topic
      web.Topics.split(', ').forEach(topic => {
        const topicElement = document.createElement('h5');
        topicElement.className = 'topic';
        topicElement.textContent = topic;
        topicElement.addEventListener('click', (event) => {
          event.stopImmediatePropagation();
          searchBar.value = topicElement.textContent;
          updateWebDisplay();
        })
        topicsDiv.appendChild(topicElement);
      });
      webTitlesDiv.appendChild(webTitle);
      webTitlesDiv.appendChild(username);
  
      webContainer.appendChild(profileImage);
      webContainer.appendChild(webTitlesDiv);
      webContainer.appendChild(likeIcon);
      webContainer.appendChild(topicsDiv);
  
      container.appendChild(webContainer);
    });
  }
  

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
  routeButton("add-web-btn", "/?path=create");
  let clearButton = document.getElementById("search-clear")
  clearButton.addEventListener('click', (event) => {
    searchBar.value = "";
    updateWebDisplay();
  });
}