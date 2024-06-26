import { fetchWithAuth } from "./authRequest.js";
import { routeButton } from "./PathManager.js";
import { openLoader, closeLoader } from "./loader.js";

async function fetchWebPosts(webId){
  let result=(await fetchWithAuth(`webs/postsInWeb?webId=${webId}`));
  if (!result.ok){
    window.location.href='/?path=home&badWeb=true';
  }
  result=await result.json();
  return result;
}

export async function web() {
  const urlParams = new URLSearchParams(window.location.search);
  let webId = urlParams.get('webid');
  openLoader();
  let data = await fetchWebPosts(webId);
  let title = data.webTitle;
  let webBackBtn = document.getElementById('web-back-btn');
  const webTitle = document.createElement('h1');
  webTitle.textContent = title;
  webBackBtn.appendChild(webTitle);

  let webPosts = data.webPosts;
  // Start populating the post containers:
  // Will have to select the posts element  by id, then add a post container with post info each time.
  let allPostsContainer = document.getElementById('posts');
  webPosts.forEach(post => {
    let postContainer = document.createElement("section");
    postContainer.className = "post-container";
    postContainer.postId = post.PostId;
    allPostsContainer.appendChild(postContainer);
      let postHeader = document.createElement("section");
      postHeader.className = "post-header";
      postContainer.appendChild(postHeader);
        let postTopic = document.createElement("h1");
        postTopic.className = "post-topic";
        postTopic.textContent = post.Topic;
        postHeader.appendChild(postTopic);



        let postCarouselContainer = document.createElement("section");
        postCarouselContainer.className = "post-carousel-container";
        postContainer.appendChild(postCarouselContainer);
          let imageCarousel = document.createElement("div");
          imageCarousel.className = "image-carousel";
          postCarouselContainer.appendChild(imageCarousel);
          let i = 0;
          post.PostImages.forEach(image=>{
            let currImage = document.createElement("img");
            currImage.src = image.Path.replace("+","%2B");
            imageCarousel.appendChild(currImage);
            i++;
            currImage.classList.add("carousel-image");
            if (i==1){
              currImage.classList.add("ease-in");
            } else {
              currImage.classList.add("ease-out");
              currImage.classList.add("slide-right");
            }
          });
          if (post.PostImages.length > 1){
            let prevArrow = document.createElement("a");
            prevArrow.classList.add("prev");
            prevArrow.classList.add("arrow");
            prevArrow.innerHTML = '&#10094;';
            postCarouselContainer.appendChild(prevArrow);
            let nextArrow = document.createElement("a");
            nextArrow.classList.add("next");
            nextArrow.classList.add("arrow");
            nextArrow.innerHTML = '&#10095;';
            postCarouselContainer.appendChild(nextArrow);
            let slideNumbers = document.createElement("div");
            slideNumbers.className = "slide-numbers";
            postCarouselContainer.appendChild(slideNumbers);
            for (let k=0;k<i;k++){
              let newSpan = document.createElement("span");
              slideNumbers.appendChild(newSpan);
              newSpan.classList.add("dot")
              if (k==0){
                newSpan.classList.add("active");
              }
            }
          }

          let postCaption = document.createElement("article");
          postCaption.className = "post-caption";
          postCaption.textContent = post.Caption
          postContainer.appendChild(postCaption);
  });

  let postContainers = document.querySelectorAll('.post-container');

  postContainers.forEach(postContainer => {
    let prev = postContainer.querySelector('.prev');
    let next = postContainer.querySelector('.next');
    let imgs = postContainer.querySelectorAll('.carousel-image');
    let dots = postContainer.querySelectorAll('.dot');
    let totalImgs = imgs.length;
    let imgPosition = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    if (prev != null && next != null && dots != null) {
      next.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        nextImg();
      });
      prev.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        prevImg();
      });
      dots.forEach((dot, dotPosition) => {
        dot.addEventListener("click", (event) => {
          event.stopImmediatePropagation();
          while(imgPosition !== dotPosition){
            if (dotPosition > imgPosition){
              nextImg();
            } else {
              prevImg();
            }
          }
        });
      });
    }

    postContainer.addEventListener('touchstart', handleTouchStart);
    postContainer.addEventListener('touchmove', handleTouchMove);
    postContainer.addEventListener('touchend', handleTouchEnd);
    // End populating post containers
    function updatePosition() {
      for (let dot of dots) {
        dot.className = dot.className.replace("active", "");
      }
      dots[imgPosition].classList.add('active');
    }

    function nextImg() {
      if (imgPosition >= totalImgs - 1) { return }
      imgs[imgPosition].classList.add('slide-left');
      imgs[imgPosition].classList.add('ease-out');
      imgs[imgPosition].classList.remove('ease-in');
      imgPosition = (imgPosition + 1) % totalImgs;
      imgs[imgPosition].classList.remove('slide-left', 'slide-right', 'ease-out');
      imgs[imgPosition].classList.add('ease-in');
      updatePosition();
    }

    function prevImg() {
      if (imgPosition <= 0) { return }
      imgs[imgPosition].classList.add('slide-right');
      imgs[imgPosition].classList.add('ease-out');
      imgs[imgPosition].classList.remove('ease-in');
      imgPosition = (imgPosition - 1 + totalImgs) % totalImgs;
      imgs[imgPosition].classList.remove('slide-left', 'slide-right', 'ease-out');
      imgs[imgPosition].classList.add('ease-in');
      updatePosition();
    }

    function handleTouchStart(event) {
      if (event.target === prev || event.target === next) return;
      touchStartX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      if (event.target === prev || event.target === next) return;
      touchEndX = event.touches[0].clientX;
    }

    function handleTouchEnd() {
      if (touchStartX - touchEndX > 50) {
        nextImg();
      } else if (touchEndX - touchStartX > 50) {
        prevImg();
      }
      touchStartX = 0;
      touchEndX = 0;
    }
  });
  routeButton("web-back-btn");
  closeLoader();
}