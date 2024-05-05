import { fetchWithAuth } from "./authRequest.js";
import { routeButton } from "./PathManager.js";

async function populateWebPosts(webId){
  var result=(await fetchWithAuth(`webs/postsInWeb?webId=${webId}`));
  result=await result.json();
  return result;
}

export async function web() {
  const urlParams = new URLSearchParams(window.location.search);
  let webId = urlParams.get('webid');
  var webPosts = await populateWebPosts(webId);
  // Start populating the post containers:
  // Will have to select the posts element  by id, then add a post container with post info each time.
  let allPostsContainer = document.getElementById('posts');
  webPosts.forEach(post => {
    var postContainer = document.createElement("section");
    postContainer.className = "post-container";
    postContainer.postId = post.PostId;
    allPostsContainer.appendChild(postContainer);
      var postHeader = document.createElement("section");
      postHeader.className = "post-header";
      postContainer.appendChild(postHeader);
        var postTopic = document.createElement("h1");
        postTopic.className = "post-topic";
        postTopic.textContent = post.Topic;
        postHeader.appendChild(postTopic);
        var postDate = document.createElement("time");
        postDate.className = "post-date";
        postDate.setAttribute("datetime", post.TimeCreated);
        postHeader.appendChild(postDate);

        var postCarouselContainer = document.createElement("section");
        postCarouselContainer.className = "post-carousel-container";
        postContainer.appendChild(postCarouselContainer);
          var imageCarousel = document.createElement("div");
          imageCarousel.className = "image-carousel";
          postCarouselContainer.appendChild(imageCarousel);
          var i = 0;
          post.PostImages.forEach(image=>{
            var currImage = document.createElement("img");
            currImage.src = image.Path;
            imageCarousel.appendChild(currImage);
            i++;
            currImage.classList.add("carousel-image");
            if (i==1){
            currImage.classList.add("visible");
            } else {
              currImage.classList.add("hidden");
            }
          });
          if (post.PostImages.length > 1){
            var prevArrow = document.createElement("a");
            prevArrow.classList.add("prev");
            prevArrow.classList.add("arrow");
            prevArrow.innerHTML = '&#10094;';
            postCarouselContainer.appendChild(prevArrow);
            var nextArrow = document.createElement("a");
            nextArrow.classList.add("next");
            nextArrow.classList.add("arrow");
            nextArrow.innerHTML = '&#10095;';
            postCarouselContainer.appendChild(nextArrow);
            var slideNumbers = document.createElement("div");
            slideNumbers.className = "slide-numbers";
            postCarouselContainer.appendChild(slideNumbers);
            for (var k=0;k<i;k++){
              var newSpan = document.createElement("span");
              slideNumbers.appendChild(newSpan);
              newSpan.classList.add("dot")
              if (k==0){
                newSpan.classList.add("active");
              }
            }
          }

          var postCaption = document.createElement("article");
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
      next.addEventListener('click', nextImg);
      prev.addEventListener('click', prevImg);
      dots.forEach((dot, dotPosition) => {
        dot.addEventListener("click", () => {
          imgPosition = dotPosition;
          updatePosition();
        });
      });
    }

    postContainer.addEventListener('touchstart', handleTouchStart);
    postContainer.addEventListener('touchmove', handleTouchMove);
    postContainer.addEventListener('touchend', handleTouchEnd);
    // End populating post containers
    function updatePosition() {
      imgs.forEach(img => {img.classList.add('hidden'); img.classList.remove('visible')});
      imgs[imgPosition].classList.remove('hidden');
      imgs[imgPosition].classList.add('visible');

      for (let dot of dots) {
        dot.className = dot.className.replace(" active", "");
      }
      dots[imgPosition].classList.add('active');
    }

    function nextImg() {
      imgPosition = (imgPosition + 1) % totalImgs;
      updatePosition();
    }

    function prevImg() {
      imgPosition = (imgPosition - 1 + totalImgs) % totalImgs;
      updatePosition();
    }

    function handleTouchStart(event) {
      touchStartX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
      touchEndX = event.touches[0].clientX;
    }

    function handleTouchEnd() {
      if (touchStartX - touchEndX > 50) {
        nextImg();
      } else if (touchEndX - touchStartX > 50) {
        prevImg();
      }
    }
  });
  routeButton("web-back-btn");
}