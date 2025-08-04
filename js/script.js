document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    setTimeout(function() {
        document.querySelector('.preloader').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.preloader').style.display = 'none';
        }, 500);
    }, 1500);

    // Mobile menu toggle
    const navIndicator = document.querySelector('.nav-indicator');
    const mainNav = document.querySelector('.main-nav');
    
    navIndicator.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Current year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize EmailJS (replace with your credentials)
    emailjs.init('YOUR_EMAILJS_USER_ID');

    // Booking system
    const bookingModal = document.getElementById('booking-modal');
    const serviceButtons = document.querySelectorAll('.service-btn');
    const closeModal = document.querySelector('.close-modal');
    const continueBtn = document.getElementById('continue-to-step2');
    const bookingForm = document.getElementById('customer-info-form');

    // Open booking modal
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            const price = this.getAttribute('data-price');
            const duration = this.getAttribute('data-duration');
            
            document.getElementById('booking-service-name').textContent = service;
            document.getElementById('booking-service-price').textContent = '$' + price;
            document.getElementById('booking-service-duration').textContent = duration;
            
            bookingModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Booking form submission
    document.getElementById('customer-info-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const service = document.getElementById('booking-service-name').textContent;
        const price = document.getElementById('booking-service-price').textContent.replace('$','');
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        const timeOfDay = document.querySelector('input[name="time-of-day"]:checked').value;
        const name = document.getElementById('customer-name').value;
        const email = document.getElementById('customer-email').value;
        const phone = document.getElementById('customer-phone').value;
        const notes = document.getElementById('customer-notes').value || 'None';
        
        // Create form data
        const formData = new FormData();
        formData.append('service', service);
        formData.append('price', price);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('timeOfDay', timeOfDay);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('notes', notes);
        
        // Submit to PHP
        fetch('booking.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'index.html?booking=success';
            } else {
                window.location.href = 'index.html?booking=error';
            }
        })
        .catch(error => {
            window.location.href = 'index.html?booking=error';
        });
    });

    // Check for booking success/error on page load
    const urlParams = new URLSearchParams(window.location.search);
    const bookingStatus = urlParams.get('booking');
    
    if (bookingStatus === 'success') {
        alert('Booking confirmed! Check your email for details.');
        // Reset form if needed
        document.getElementById('booking-form').reset();
        document.getElementById('customer-info-form').reset();
    } else if (bookingStatus === 'error') {
        //alert('There was an error processing your booking. Please try again.');
    }

    // Continue to step 2
    continueBtn.addEventListener('click', function() {
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        
        if (!date || !time) {
            alert('Please select both date and time');
            return;
        }
        
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    });

    // Set minimum booking date to today
    document.getElementById('booking-date').min = new Date().toISOString().split('T')[0];

    // Style the time dropdown
    const timeSelect = document.getElementById('booking-time');
    if (timeSelect) {
        timeSelect.style.backgroundColor = 'rgba(0,0,0,0.5)';
        timeSelect.style.color = 'var(--light)';
        timeSelect.style.border = '1px solid rgba(255,255,255,0.2)';
    }
});