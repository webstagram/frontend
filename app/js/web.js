import { routeButton } from "./PathManager.js";
export function web() {
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