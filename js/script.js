// Handle form submission via AJAX
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Create an object from the form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Log the data to ensure it's correct
    console.log('Form Data:', formData);

    // Send the data as JSON to the backend
    fetch('/submit-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(formData) // Convert the form data to JSON
    })
    .then(response => {
        if (response.ok) {
            // Show confirmation message and hide the form
            document.getElementById('confirmation-message').style.display = 'block';
            document.getElementById('contact-form').style.display = 'none';
        } else {
            alert('There was an error submitting your message. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your message. Please try again.');
    });
});
