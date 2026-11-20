const track = document.querySelector("#room-track");
const cards = [...document.querySelectorAll(".room-card")];
const dots = [...document.querySelectorAll(".pagination span")];
const pageLoader = document.querySelector("#page-loader");
const pageIntro = document.querySelector("#page-intro");
let roomIndex = 0;
let introStarted = false;
let introFinished = false;

function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  pageLoader.classList.add("page-loader--hidden");
  window.setTimeout(() => pageLoader.remove(), 350);
}

function playIntro() {
  if (introStarted) return;
  introStarted = true;
  window.setTimeout(finishIntro, 14600);
}

pageIntro.addEventListener("load", playIntro, { once: true });
pageIntro.addEventListener("error", finishIntro, { once: true });
if (pageIntro.complete) {
  if (pageIntro.naturalWidth > 0) {
    playIntro();
  } else {
    finishIntro();
  }
}

function updateRooms() {
  if (window.innerWidth > 700) {
    track.style.transform = "";
    return;
  }

  track.style.transform = `translateX(-${roomIndex * 100}%)`;
  dots.forEach((dot, index) => dot.classList.toggle("active", index === roomIndex));
}

document.querySelector("#room-prev").addEventListener("click", () => {
  roomIndex = (roomIndex - 1 + cards.length) % cards.length;
  updateRooms();
});

document.querySelector("#room-next").addEventListener("click", () => {
  roomIndex = (roomIndex + 1) % cards.length;
  updateRooms();
});

window.addEventListener("resize", updateRooms);

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.querySelector("#form-message");
  message.textContent = "Thank you for subscribing.";
  form.reset();
});

updateRooms();
