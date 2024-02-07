document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Extract form data
  const formData = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
  };
  console.log('Sending login data:', formData);
  // Send the form data to API endpoint
  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  .then(response => {
    if (!response.ok) {
      // If the response is not ok, parse the JSON body and log it to get the error message
      return response.json().then(errorData => {
        throw new Error('Failed to login: ' + errorData.message);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // For debugging
    // Redirect on successful login
    window.location.href = '/dashboard';
  })
  .catch((error) => {
    console.error('Error:', error);
    console.error('Error:', error.message);
    alert('Login failed: Incorrect username or password.');
  });
});
