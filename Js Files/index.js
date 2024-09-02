document.getElementById('Loginbtn').addEventListener('click', function () {
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset placeholder messages
    emailInput.placeholder = 'Enter your Email';
    passwordInput.placeholder = 'Password';

    // Validation for empty fields
    let isValid = true;

    if (!email) {
        emailInput.placeholder = 'Email is required';
        emailInput.classList.add('border-red-500');
        isValid = false;
    } else {
        emailInput.classList.remove('border-red-500');
    }

    if (!password) {
        passwordInput.placeholder = 'Password is required';
        passwordInput.classList.add('border-red-500');
        isValid = false;
    } else {
        passwordInput.classList.remove('border-red-500');
    }

    if (!isValid) {
        return;
    }

    // Retrieve existing signup details from local storage
    let signupDetails = JSON.parse(localStorage.getItem('Signupdetails')) || [];

    // Check if the email and password match any user
    const user = signupDetails.find(user => user.email === email && user.password === password);

    if (user) {
        // Store the logged-in user's name in localStorage
        localStorage.setItem('LoggedInUser', user.fullName);
        alert('Login successful!');
        // Redirect to index.html after successful login
        window.location.href = '/Pages/Main.html';
    } else {
        emailInput.value = '';
        passwordInput.value = '';
        emailInput.placeholder = 'Invalid email or password';
        emailInput.classList.add('border-red-500');
        passwordInput.placeholder = 'Invalid email or password';
        passwordInput.classList.add('border-red-500');
    }
});