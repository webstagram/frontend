import { routeButton } from "./PathManager.js";
export function add_web() {
  let no_post_msg = document.getElementById('add-web-no-posts-msg');
  let add_post_btn = document.getElementById('add-web-add-post-btn');
  let posts_container = document.getElementById('posts-container');
  let max_posts = 5;

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
      title_label.htmlFor = 'title';
      title_label.className = 'add-post-title-label';
      title_label.innerText = 'post topic';
      let title_input = document.createElement('input');
      title_input.className = 'add-post-title-input';
      title_input.name = 'title';
      title_input.type = 'text';
      title_input.minLength = 1;
      title_input.maxLength = 15;
      title_container.appendChild(title_label);
      title_container.appendChild(title_input);

      let images_container = document.createElement('section');
      images_container.className = 'add-post-images-container';
      let images_label = document.createElement('label');
      images_label.className = 'add-post-images-label';
      images_label.innerText = 'select photos';
      let image_select = document.createElement('input');
      image_select.className = 'add-post-images';
      image_select.type = 'file';
      image_select.accept = 'image/*';
      image_select.min = 1;
      image_select.max = 5;
      image_select.multiple = true;
      images_container.appendChild(images_label);
      images_container.appendChild(image_select);

      let remove_post_btn = document.createElement('button');
      remove_post_btn.className = 'remove-post-button';
      remove_post_btn.type = 'button';
      remove_post_btn.innerText = '✗';

      post.appendChild(title_container);
      post.appendChild(images_container);
      post.appendChild(remove_post_btn);

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
  routeButton("add-web-back-btn", "/");

}