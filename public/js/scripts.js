document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded successfully");

  // Initialize Swiper for testimonials
  try {
    const swiper = new Swiper(".swiper", {
      loop: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      autoplay: { delay: 5000 },
    });
    console.log("Swiper initialized successfully");
  } catch (error) {
    console.error("Error initializing Swiper:", error);
  }

  // Set current timestamp for form
  const submissionTimeInput = document.getElementById("submissionTime");
  if (submissionTimeInput) {
    submissionTimeInput.value = new Date().toISOString();
    console.log("Submission time set:", submissionTimeInput.value);
  } else {
    console.error("Submission time input not found");
  }

  // Set minimum date/time for appointment
  const dateInput = document.getElementById("appointmentDate");
  if (dateInput) {
    const now = new Date();
    const localISOTime = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    dateInput.min = localISOTime;
    console.log("Date input minimum set to:", localISOTime);
  } else {
    console.error("Appointment date input not found");
  }

  // Handle form submission
  const form = document.getElementById("appointmentForm");
  if (!form) {
    console.error("Appointment form not found");
    return;
  }
  console.log("Appointment form found");

  // Remove any existing submit listeners to prevent conflicts
  form.removeEventListener("submit", handleFormSubmit); // Ensure no duplicate listeners
  form.addEventListener("submit", handleFormSubmit);

  async function handleFormSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    e.stopPropagation(); // Stop event bubbling to prevent other handlers
    console.log("Form submission intercepted, default behavior prevented");

    // Client-side validation
    const fields = {
      name: form.elements["entry.2005620554"].value,
      phone: form.elements["entry.1065046570"].value,
      email: form.elements["entry.1045781291"].value,
      date: form.elements["entry.1166974658"].value,
      service: form.querySelector('input[name="entry.2038385665"]:checked'),
      doctor: form.elements["entry.839337160"].value,
      concerns: form.elements["entry.209192588"].value,
    };

    console.log("Form data for validation:", fields);

    if (!fields.name || fields.name.length < 2) {
      alert("Please enter a valid name");
      form.elements["entry.2005620554"].focus();
      return;
    }
    if (!fields.phone || !/^\d{10}$/.test(fields.phone)) {
      alert("Please enter a valid 10-digit phone number");
      form.elements["entry.1065046570"].focus();
      return;
    }
    if (!fields.email || !/^\S+@\S+\.\S+$/.test(fields.email)) {
      alert("Please enter a valid email address");
      form.elements["entry.1045781291"].focus();
      return;
    }
    if (!fields.date || new Date(fields.date) < new Date()) {
      alert("Please select a future date and time");
      form.elements["entry.1166974658"].focus();
      return;
    }
    if (!fields.service) {
      alert("Please select a service");
      return;
    }
    if (!fields.doctor) {
      alert("Please select a doctor");
      form.elements["entry.839337160"].focus();
      return;
    }
    if (!fields.concerns || fields.concerns.trim() === "") {
      alert("Please share your concerns or questions");
      form.elements["entry.209192588"].focus();
      return;
    }

    const submitBtn = form.querySelector(".submit-btn");
    if (!submitBtn) {
      console.error("Submit button not found");
      return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
      // Prepare form data
      const formData = new FormData(form);
      console.log("Form data being sent:", Object.fromEntries(formData));

      // Submit to Google Forms via AJAX
      await fetch(form.action, {
        method: "POST",
        body: formData,
        mode: "no-cors", // Required for Google Forms
      });

      console.log("Form submitted successfully to Google Forms");

      // Show success message
      const successMessage = document.getElementById("successMessage");
      if (successMessage) {
        successMessage.style.display = "block";
        form.reset(); // Clear form
        submissionTimeInput.value = new Date().toISOString(); // Reset timestamp
        setTimeout(() => {
          successMessage.style.display = "none";
        }, 5000);
      } else {
        console.error("Success message element not found");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Appointment';
    }
  }

  console.log("Script execution completed");
});

console.log("Script file loaded");
