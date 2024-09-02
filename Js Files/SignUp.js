document.getElementById('SignUpbtn').addEventListener('click', function () {
    // Get input values
    const fullNameInput = document.getElementById('FullName');
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');
    const confirmPasswordInput = document.getElementById('ConfirmPassword');

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Reset placeholder messages
    fullNameInput.placeholder = 'Enter your Name';
    emailInput.placeholder = 'Enter your Email';
    passwordInput.placeholder = 'Password';
    confirmPasswordInput.placeholder = 'Confirm Password';

    // Validation for empty fields and passwords mismatch
    let isValid = true;

    if (!fullName) {
        fullNameInput.placeholder = 'Name is required';
        fullNameInput.classList.add('border-red-500');
        isValid = false;
    } else {
        fullNameInput.classList.remove('border-red-500');
    }

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

    if (!confirmPassword) {
        confirmPasswordInput.placeholder = 'Confirm your Password';
        confirmPasswordInput.classList.add('border-red-500');
        isValid = false;
    } else {
        confirmPasswordInput.classList.remove('border-red-500');
    }

    if (password && confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.value = '';
        confirmPasswordInput.placeholder = 'Passwords do not match';
        confirmPasswordInput.classList.add('border-red-500');
        isValid = false;
    } else {
        confirmPasswordInput.classList.remove('border-red-500');
    }

    // If the form is not valid, stop here
    if (!isValid) {
        return;
    }

    // Retrieve existing signup details from local storage
    let signupDetails = JSON.parse(localStorage.getItem('Signupdetails')) || [];

    // Check if the email already exists
    const userExists = signupDetails.some(user => user.email === email);

    if (userExists) {
        // If user already exists, show a message and stop
        emailInput.value = '';
        emailInput.placeholder = 'User already exists';
        emailInput.classList.add('border-red-500');
        return;
    }

    // Determine the new user ID
    let newUserId = signupDetails.length > 0 ? signupDetails[signupDetails.length - 1].id + 1 : 1;

    // Create a new user object
    let newUser = {
        id: newUserId,
        fullName: fullName,
        email: email,
        password: password
    };

    // Add the new user to the existing signup details
    signupDetails.push(newUser);

    // Save updated signup details back to local storage
    localStorage.setItem('Signupdetails', JSON.stringify(signupDetails));

    // Notify the user and reset form
    alert('Signup successful!');
    fullNameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
});
