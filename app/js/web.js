import { fetchWithAuth } from "./authRequest.js";

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
    var postContainer = allPostsContainer.createElement("section");
    postContainer.classList.add("post-container");

      var postHeader = postContainer.createElement("section");
      postHeader.classList.add("post-header");
        var postTopic = postHeader.createElement("h1");
        postTopic.classList.add("post-topic")
        postTopic.textContent = post.Topic;
        var postDate = postHeader.createElement("time");
        postDate.classList.add("post-date");
        postDate.setAttribute("datetime", post.TimeCreated);

        var postCarouselContainer = postContainer.createElement("section");
        postCarouselContainer.classList.add("post-carousel-container");
          var imageCarousel = postCarouselContainer.createElement("div");
          var i = 0;
          post.PostImages.forEach(image=>{
            var currImage = imageCarousel.createElement("img");
            currImage.setAttribute("src", image.Path);
            i++;
            if (i==1){
            currImage.setAttribute("class", "carousel-image visible");
            } else {
              currImage.setAttribute("class", "carousel-image hidden");
            }
          });
          var prevArrow = postCarouselContainer.createElement("a");
          prevArrow.classList.add("prev arrow");
          prevArrow.textContent = `&#10094;`;
          var nextArrow = postCarouselContainer.createElement("a");
          nextArrow.classList.add("next arrow");
          nextArrow.textContent = `&#10095;`;
          var slideNumbers = postCarouselContainer.createElement("div");
          slideNumbers.classList.add("slide-numbers");
          for (var k=0;k<i;k++){
            var newSpan = slideNumbers.createElement("span");
            if (k==0){
              newSpan.classList.add("dot active");
            } else {
              newSpan.classList.add("dot");
            }
          }
        
          var postCaption = postContainer.createElement("article");
          postCaption.classList.add("post-caption");
          postCaption.textContent = post.Caption
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

    next.addEventListener('click', nextImg);
    prev.addEventListener('click', prevImg);
    dots.forEach((dot, dotPosition) => {
      dot.addEventListener("click", () => {
        imgPosition = dotPosition;
        updatePosition();
      });
    });

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
}