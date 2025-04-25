<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize Swiper for testimonials
    const swiper = new Swiper('.swiper', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 5000,
      },
    });

    // Handle hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });

    // Handle appointment form submission
    const form = document.getElementById('appointmentForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        date: formData.get('date'),
        service: formData.get('service'),
        doctor: formData.get('doctor'),
        concerns: formData.get('concerns') || 'None',
        submissionTime: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      };

      try {
        // Send data to the backend
        const response = await fetch('/book-appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // Generate PDF client-side
          generatePDF(data);
          alert('Appointment booked successfully! A confirmation PDF has been downloaded.');
          form.reset();
        } else {
          throw new Error('Failed to book appointment');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('There was an error booking your appointment. Please try again.');
      }
    });

    function generatePDF(data) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: 'Surya Clinic Appointment Confirmation',
        author: 'Surya Clinic',
        creator: 'Surya Clinic',
      });

      // Add header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(36, 94, 122);
      doc.text('Surya Clinic', 105, 20, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(76, 175, 80);
      doc.text('Appointment Confirmation', 105, 30, { align: 'center' });

      // Add horizontal line
      doc.setDrawColor(76, 175, 80);
      doc.line(20, 35, 190, 35);

      // Add clinic details
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);
      doc.text('123 Wellness Street, Aundh, Pune, Maharashtra 411007', 105, 45, { align: 'center' });
      doc.text('Phone: +91 98765 43210 | Email: info@suryaclinic.com', 105, 50, { align: 'center' });

      // Add appointment details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(36, 94, 122);
      doc.text('Appointment Details', 20, 65);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      doc.text(`Name: ${data.name}`, 20, 75);
      doc.text(`Phone: ${data.phone}`, 20, 85);
      doc.text(`Email: ${data.email}`, 20, 95);
      doc.text(`Preferred Date: ${new Date(data.date).toLocaleDateString('en-IN')}`, 20, 105);
      doc.text(`Service: ${data.service}`, 20, 115);
      doc.text(`Preferred Doctor: ${data.doctor}`, 20, 125);
      doc.text(`Submission Time: ${data.submissionTime}`, 20, 135);

      // Add concerns if provided
      if (data.concerns !== 'None') {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(36, 94, 122);
        doc.text('Specific Concerns:', 20, 145);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 51, 51);
        const concernsText = doc.splitTextToSize(data.concerns, 170);
        doc.text(concernsText, 20, 155);
      }

      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(136, 143, 152);
      doc.text('Thank you for choosing Surya Clinic!', 105, 270, { align: 'center' });
      doc.text('We look forward to assisting you with your healthcare needs.', 105, 275, { align: 'center' });

      // Save the PDF
      doc.save(`Surya_Clinic_Appointment_${data.name}_${data.date}.pdf`);
    }
  });
</script>