import { openPopup, closePopup } from "./popup.js";
import { routeButton } from "./PathManager.js";
import { openAlert } from "./alert.js";
import { closeLoader, openLoader } from "./loader.js";

export function add_web() {
  let no_post_msg = document.getElementById('add-web-no-posts-msg');
  let add_post_btn = document.getElementById('add-web-add-post-btn');
  let posts_container = document.getElementById('posts-container');
  const add_web_save_btn = document.getElementById('add-web-save-btn');
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
      title_input.name = 'postTopic';
      title_input.type = 'text';
      title_input.minLength = 1;
      title_input.maxLength = 15;
      title_container.appendChild(title_label);
      title_container.appendChild(title_input);

      title_container.appendChild(createLabel('Caption'));
      title_container.appendChild(createInput('postCaption'))

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

      image_select.addEventListener('change', ({target: {files}}) => {
        const selectedImages = images_container.querySelectorAll('img').length;
        if (selectedImages >= 5) return;
        for (let i = 0; i < 5 - selectedImages; i++) {
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
        if (posts.length === 0) {
          no_post_msg.style.display = 'block';
        }
        add_post_btn.style.display = 'block';
      });

      posts_container.appendChild(post);
    }
  });

  add_web_save_btn.addEventListener('click', () => {
    const posts = document
      .getElementById('posts-container')
      .querySelectorAll('.add-post-container');

    let isValid = false;
    const formData = [...posts].map((cur) => {
      let obj = {'selectedImages': []};

      cur.querySelectorAll('input').forEach((input) => {
        if (input.type !== 'text') return;

        isValid = isValid || input.value.length == 0;
        obj[input.name] = input.value; 
      });

      const imgs = cur.querySelectorAll('img')
      isValid = isValid || imgs.length == 0;
      
      imgs.forEach((img) => {
        obj['selectedImages'].push(img.src);
      });

      return obj;
    });  

    const webTitle = document.getElementById('webTitle').value;
    
    if (
      isValid 
      || formData.length === 0 
      || webTitle.length === 0
    ) return openAlert('Please create a post and fill out all the fields');

    openLoader();
  
    // make request
    console.log({
      webTitle,
      'posts': formData,
    });

    setTimeout(() => {
      closeLoader()
      openPopup('Successfully posted!', () => closePopup());
    } , 2000);
    
  });
  
  routeButton("add-web-back-btn", "/");
}