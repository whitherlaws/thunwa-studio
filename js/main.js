document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0; // Variable to store the previous scroll position
  const header = document.getElementById("site-header");

  window.addEventListener(
    "scroll",
    function () {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // 1. If at the very top, hide the header
      if (currentScrollTop <= 0) {
        header.classList.remove("show-header");
      }
      // 2. If scrolling UP, show the header
      else if (currentScrollTop < lastScrollTop) {
        header.classList.add("show-header");
      }
      // 3. If scrolling DOWN, hide the header
      else {
        header.classList.remove("show-header");
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    },
    { passive: true },
  );

  const textElement = document.getElementById("rotating-text");
  const texts = ["user testing", "prototyping", "branding", "marketing"]; // Added periods for consistency
  let index = 0;

  // Total cycle time (e.g., 3000ms) = time text is visible + transition time
  const displayTime = 2500; // Time text is fully visible (2.5s)
  const transitionTime = 300; // Time for fadeOut/fadeIn (0.3s)

  function rotateText() {
    // --- STEP 1: Fade Out ---
    // 1. Add fade-out class (removes fade-in class if present)
    textElement.classList.remove("fade-in");
    textElement.classList.add("fade-out");

    // --- STEP 2: Change Content (Wait for Fade Out) ---
    setTimeout(() => {
      // 2. Change the text content while it is fully invisible
      index = (index + 1) % texts.length;
      textElement.textContent = texts[index];

      // --- STEP 3: Fade In ---
      // 3. Remove fade-out class and add fade-in class
      textElement.classList.remove("fade-out");
      textElement.classList.add("fade-in");
    }, transitionTime); // Wait for the fadeOut animation (0.3s)
  }

  // --- Initialization ---
  // 1. Set initial text
  textElement.textContent = texts[index];
  // 2. Immediately start the first fade-in
  textElement.classList.add("fade-in");

  // --- Start Rotation Cycle ---
  // The total interval is the time the text is visible plus the time it takes to transition (one side)
  setInterval(rotateText, displayTime);

  // Optional: Smooth scrolling for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // GSAP ScrollTrigger animations
  gsap.registerPlugin(ScrollTrigger);

  // Target all major sections
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 85%", // Starts when the top of the section is 85% down the viewport
        toggleActions: "restart none none reset", // Plays once and stays visible
      },
    });
  });

  // This targets the cards inside the services section
  gsap.to(".service-card", {
    scrollTrigger: {
      trigger: ".services-grid",
      start: "top 80%",
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2, // 0.2 seconds delay between each card
    ease: "back.out(1.7)", // Adds a slight "bounce" effect
  });

  // This targets the cards inside the projects section
  gsap.to(".project-card", {
    // Fixed: Changed from .project to .project-card
    scrollTrigger: {
      trigger: ".project-grid", // Better trigger: the container of the cards
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.7)",
  });

  // Gallery
  // Function to initialize auto-sliding galleries
  function initProjectGalleries() {
    const galleries = document.querySelectorAll(".gallery");

    galleries.forEach((gallery) => {
      const images = gallery.querySelectorAll("img");
      if (images.length <= 1) return; // Don't slide if there's only one image

      let currentIndex = 0;

      // Create a repeating timer
      setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;

        // Fade out current image
        gsap.to(images[currentIndex], {
          opacity: 0,
          duration: 1,
          ease: "power1.inOut",
        });

        // Fade in next image
        gsap.to(images[nextIndex], {
          opacity: 1,
          duration: 1,
          ease: "power1.inOut",
        });

        currentIndex = nextIndex;
      }, 3000); // 3 seconds per slide
    });
  }

  // Run the function
  initProjectGalleries();
});
