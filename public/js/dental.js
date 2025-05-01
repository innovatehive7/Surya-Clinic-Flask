document.addEventListener("DOMContentLoaded", () => {
  console.log("dental.js loaded on page:", document.body.dataset.page);

  // Handle hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    console.log("dental.js: Hamburger and nav-links found");

    hamburger.addEventListener("click", () => {
      console.log("dental.js: Hamburger clicked");
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");
      hamburger.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        console.log("dental.js: Nav link clicked:", link.textContent);
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  } else {
    console.error("dental.js: Error: Hamburger or nav-links not found in the DOM");
  }

  // Add intersection observer for cards
  const cards = document.querySelectorAll(".card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeInUp 0.6s ease forwards ${
            entry.target.style.getPropertyValue("--animation-delay")
          }`;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card, index) => {
    card.style.setProperty("--animation-delay", `${index * 0.1}s`);
    observer.observe(card);
  });

  // Add pulse animation to book button periodically
  const bookBtn = document.querySelector(".book-button");
  if (bookBtn) {
    setInterval(() => {
      bookBtn.style.animation = "pulse 1.5s ease";
      setTimeout(() => {
        bookBtn.style.animation = "";
      }, 1500);
    }, 8000);
  }
});
