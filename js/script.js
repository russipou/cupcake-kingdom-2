// =========================================================
// CUPCAKE KINGDOM — shared behaviour
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initCarousel();
  initScrollReveal();
  initContactForm();
});

/* ---------------------------------------------------------
   Mobile nav toggle
--------------------------------------------------------- */
function initNavToggle() {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   "See My Work" carousel
   One big centre photo, a smaller photo on each side, and
   arrows that step through every photo in the collection.
--------------------------------------------------------- */
function initCarousel() {
  var root = document.getElementById("workCarousel");
  if (!root) return;

  var photos = JSON.parse(root.getAttribute("data-photos"));
  var current = 0;

  var mainImg = document.getElementById("carouselMain");
  var prevImg = document.getElementById("carouselPrev");
  var nextImg = document.getElementById("carouselNext");
  var caption = document.getElementById("carouselCaption");
  var dotsWrap = document.getElementById("carouselDots");
  var prevBtn = document.getElementById("carouselPrevBtn");
  var nextBtn = document.getElementById("carouselNextBtn");

  photos.forEach(function (_, i) {
    var dot = document.createElement("span");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  function render() {
    var len = photos.length;
    var prevIndex = (current - 1 + len) % len;
    var nextIndex = (current + 1) % len;

    mainImg.src = photos[current].src;
    mainImg.alt = photos[current].alt;
    prevImg.src = photos[prevIndex].src;
    prevImg.alt = photos[prevIndex].alt;
    nextImg.src = photos[nextIndex].src;
    nextImg.alt = photos[nextIndex].alt;
    caption.textContent = photos[current].caption;

    dotsWrap.querySelectorAll(".carousel-dot").forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
    });
  }

  function goTo(index) {
    var len = photos.length;
    current = (index + len) % len;
    render();
  }

  prevBtn.addEventListener("click", function () { goTo(current - 1); });
  nextBtn.addEventListener("click", function () { goTo(current + 1); });
  prevImg.addEventListener("click", function () { goTo(current - 1); });
  nextImg.addEventListener("click", function () { goTo(current + 1); });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  render();
}

/* ---------------------------------------------------------
   Scroll reveal — sections fade and rise into place
--------------------------------------------------------- */
function initScrollReveal() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in-view"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (el) { observer.observe(el); });
}

/* ---------------------------------------------------------
   Contact form
   No backend is wired up yet, so submitting opens the
   visitor's email app with the details pre-filled.
--------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var subject = form.subject.value.trim() || "Cupcake order enquiry";
    var message = form.message.value.trim();

    var body =
      "Name: " + name + "\n" +
      "Email: " + email + "\n\n" +
      message;

    var mailto =
      "mailto:orders.cupcakekingdom@gmail.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailto;
  });
}
