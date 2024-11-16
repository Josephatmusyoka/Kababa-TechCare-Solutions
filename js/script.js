// Select the form element and message container
const form = document.querySelector('#contact-form');
const messageContainer = document.querySelector('#message-container');

// Form submission handler
form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the form data
    const formData = new FormData(form);
    const formDataObject = {};

    // Convert form data to a plain object
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    // Log the form data (for debugging)
    console.log('Form Data Submitted:', formDataObject);

    try {
        // Make an AJAX request to send the form data to the server
        const response = await fetch('/submit-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        });

        // Parse the response from the server
        const result = await response.text();

        if (response.ok) {
            // Success message
            messageContainer.innerHTML = `<div class="success-message">${result}</div>`;
            form.reset(); // Reset the form fields after successful submission
        } else {
            // Error message
            messageContainer.innerHTML = `<div class="error-message">${result}</div>`;
        }
    } catch (error) {
        // Handle network or server errors
        console.error('Error submitting the form:', error);
        messageContainer.innerHTML = `<div class="error-message">There was an error submitting your message. Please try again later.</div>`;
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Toggle the mobile menu when the hamburger icon is clicked
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active'); // Toggle the active class on the menu
        menuToggle.classList.toggle('active'); // Toggle the active class on the hamburger icon
    });

    // Close the menu when a menu item is clicked
    const menuLinks = document.querySelectorAll('#nav-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active'); // Close the menu when a link is clicked
            menuToggle.classList.remove('active'); // Close the hamburger icon
        });
    });

    // Close the menu if the user clicks outside the menu or hamburger icon
    document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active'); // Close the menu
            menuToggle.classList.remove('active'); // Close the hamburger icon
        }
    });
});
