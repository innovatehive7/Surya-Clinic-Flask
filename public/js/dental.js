
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Swiper for testimonials
  const swiper = new Swiper(".swiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 5000,
    },
  });

  // Set current timestamp when form loads
  document.getElementById("submissionTime").value = new Date().toISOString();

  // Set minimum date/time for appointment
  const dateInput = document.getElementById("appointmentDate");
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 16);
  dateInput.min = localISOTime;

  // Handle appointment form submission
  const form = document.getElementById("appointmentForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      date: formData.get("date"),
      service: formData.get("service"),
      doctor: formData.get("doctor"),
      concerns: formData.get("concerns") || "None",
      submissionTime: formData.get("submissionTime"),
    };

    function validateForm(data) {
      if (!data.name || data.name.length < 2) {
        throw new Error("Please enter a valid name");
      }
      if (!data.phone || !/^\d{10}$/.test(data.phone)) {
        throw new Error("Please enter a valid 10-digit phone number");
      }
      if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }
      if (!data.date || new Date(data.date) < new Date()) {
        throw new Error("Please select a future date and time");
      }
      if (!data.service) {
        throw new Error("Please select a service");
      }
      if (!data.doctor) {
        throw new Error("Please select a doctor");
      }
    }

    try {
      validateForm(data);

      const response = await fetch("/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(await response.text()); // Log raw response for debugging
      const result = await response.json();

      if (response.ok) {
        alert("Appointment booked successfully!");
        form.reset();
        document.getElementById("submissionTime").value = new Date().toISOString();
      } else {
        throw new Error(result.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "There was an error booking your appointment. Please try again.");
    }
  });

  // Handle hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  hamburger.addEventListener("click", () => {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !isExpanded);
    navLinks.classList.toggle("active");
  });

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
