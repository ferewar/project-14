document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Collect the form data
  var formData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  // Send the POST request with the form data
  fetch('/api/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.errors) {
      // Display errors if any
      displaySignupErrors(data.errors);
    } else {
      // If there's no error, proceed to the dashboard
      window.location.href = '/dashboard';
    }
  })
  .catch(error => {
    // Display the error messages to the user
    displaySignupErrors(error.message);
  });
});

function displaySignupErrors(messages) {
  const errorsContainer = document.getElementById('signup-errors');
  errorsContainer.innerHTML = ''; // Clear any previous errors
  messages.forEach(message => {
    const errorPara = document.createElement('p');
    errorPara.textContent = message;
    errorsContainer.appendChild(errorPara);
  });
}
