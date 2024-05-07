import { openPopup, closePopup } from "./popup.js";
import { routeButton, routeWithoutRefresh } from "./PathManager.js";
import { fetchWithAuth } from "./authRequest.js";
import { openAlert } from "./alert.js";
import { closeLoader, openLoader } from "./loader.js";

export function add_web() {
  let no_post_msg = document.getElementById('add-web-no-posts-msg');
  let add_post_btn = document.getElementById('add-web-add-post-btn');
  let posts_container = document.getElementById('posts-container');
  let add_web_save_btn = document.getElementById('add-web-save-btn');
  let max_posts = 5;

  function createSection(className) {
    if (!className) return
    const container = document.createElement('section');
    container.className = 'add-post-title-container';
    return container;
  }

  function createLabel(innerText) {
    const label = document.createElement('label');
    label.className = 'add-post-title-label';
    label.innerText = innerText;
    return label;
  }

  function createInput(name, type = 'text') {
    if (!name) return undefined;
    const input = document.createElement('input');
    input.className = 'add-post-title-input';
    input.name = name;
    input.type = type;
    return input;
  }

  function createImg(src) {
    const img = document.createElement('img');
    img.width = 200;
    img.src = src;
    return img;
  }

  add_post_btn.addEventListener('click', () => {
    let posts = posts_container.querySelectorAll('.add-post-container');
    if (posts.length >= max_posts) {
      console.log('Max posts reached');
      return;
    } else {
      if (posts.length === max_posts - 1){
        add_post_btn.style.display = 'none';
      }
      no_post_msg.style.display = 'none';
      let post = document.createElement('section');
      post.className = 'add-post-container';

      let title_container = document.createElement('section');
      title_container.className = 'add-post-title-container';
      let title_label = document.createElement('label');
      title_label.className = 'add-post-title-label';
      title_label.innerText = 'post topic';
      let title_input = document.createElement('input');
      title_input.className = 'add-post-title-input';
      title_input.name = 'Topic';
      title_input.type = 'text';
      title_input.minLength = 1;
      title_input.maxLength = 15;
      title_container.appendChild(title_label);
      title_container.appendChild(title_input);

      title_container.appendChild(createLabel('Caption'));
      title_container.appendChild(createInput('Caption'))

      let images_container = document.createElement('section');
      images_container.className = 'add-post-images-container';
      let images_label = document.createElement('label');
      images_label.className = 'add-post-images-label';
      images_label.innerText = 'select photos';
      let image_select = document.createElement('input');
      image_select.className = 'add-post-images';
      image_select.type = 'file';
      image_select.accept = 'image/*';
      image_select.name = 'selected-image';
      image_select.min = 1;
      image_select.max = 5;
      image_select.multiple = true;
      images_container.appendChild(images_label);
      images_container.appendChild(image_select);

      let remove_post_btn = document.createElement('button');
      remove_post_btn.className = 'remove-post-button';
      remove_post_btn.type = 'button';
      remove_post_btn.innerText = 'Cancel ✗';

      post.appendChild(title_container);
      post.appendChild(images_container);
      post.appendChild(remove_post_btn);
      const maxTotalSize = 10 * 1024 * 1024;
      let currSize=0;
      image_select.addEventListener('change', ({target: {files}}) => {
        const existingImages = images_container.querySelectorAll('img');
        const numImages = existingImages.length;
        if (numImages >= 5) return;      
        // Add the size of the newly selected files
        const newSize=Array.from(files).reduce((size, file) => size + file.size, 0);
        currSize += Array.from(files).reduce((size, file) => size + file.size, 0);
        if (currSize>maxTotalSize){
          image_select.value="";
          currSize-=newSize;
          openAlert("Total file size cannot exceed 10MB per post")
          return;
        }
        for (let i = 0; i < 5 - numImages; i++) {
          if (!files || !files[i]) return;
          
          const reader = new FileReader();

          reader.onload = ({target: {result}}) => {
            const img = createImg(result);
            img.addEventListener('dblclick', () => images_container.removeChild(img))
            images_container.appendChild(img);
          };
          
          reader.readAsDataURL(files[i]);
        } 
        
      });

      remove_post_btn.addEventListener('click', () => {
        posts_container.removeChild(post);
        let posts = posts_container.querySelectorAll('.add-post-container');
        if (posts.length === 0) {
          no_post_msg.style.display = 'block';
        }
        add_post_btn.style.display = 'flex';
      });

      posts_container.appendChild(post);
    }
  });

  add_web_save_btn.addEventListener('click', async () => {
    add_web_save_btn.disabled = true;
    const posts = document
      .getElementById('posts-container')
      .querySelectorAll('.add-post-container');

    let isValid = false;
    const formData = [...posts].map((cur) => {
      let obj = {'Images': []};

      cur.querySelectorAll('input').forEach((input) => {
        if (input.type !== 'text') return;

        isValid = isValid || input.value.length == 0;
        obj[input.name] = input.value; 
      });

      cur.querySelectorAll('img').forEach((img) => {
        var fullImg = img.src;
        var part1 = fullImg.substring(0, fullImg.indexOf(","));
        fullImg = fullImg.substring(fullImg.indexOf(",")+1);
        var contentType = part1.substring(part1.indexOf(":")+1, part1.indexOf(";"));
        var extension = contentType.substring(contentType.indexOf("/")+1);
        var bodyObj = {
          'FileContent': fullImg,
          'ContentType': contentType,
          "Extension": "."+extension
        }
        obj['Images'].push(bodyObj);
      });

      return obj;
    });  
    var webTitle = document.getElementById("webTitle").value;
    if (isValid || formData.length === 0 || webTitle.length === 0){
      add_web_save_btn.disabled = false;
      return openAlert('Please create a post and fill out all the fields');
    } 
    openLoader();

    var sendMeToBackend = {};
    sendMeToBackend.WebName = webTitle;
    sendMeToBackend.Posts = formData;
    var authRequestObject = {
      "headers": {"Content-Type": "application/json"},
      "method": "POST",
      "body": JSON.stringify(sendMeToBackend)
    };
    var endpoint = "uploadposts";
    var result = await fetchWithAuth(endpoint, authRequestObject);

    closeLoader()
    if (result.status !== 200) {
      add_web_save_btn.disabled = false;
      let message="Failed to post web! Please try again.";
      if(result.status==409) message="Web with this name already exists.";
      openPopup(message, () => {
        closePopup();
      });
      return;
    } else {
      openPopup('Successfully posted!', () => {
        closePopup();
        routeWithoutRefresh("/");
      });
    }
  });
  
  routeButton("add-web-back-btn", "/");
}