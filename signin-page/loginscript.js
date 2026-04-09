window.addEventListener('DOMContentLoaded', async () => {
    console.log("✅ Login script loaded successfully");

    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const signupSuccessModal = document.getElementById('signupSuccessModal');
    const okSignupBtn = document.getElementById('okSignup');

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }

    // Mobile Toggles
    const mobileSigninToggle = document.getElementById('mobileSigninToggle');
    const mobileSignupToggle = document.getElementById('mobileSignupToggle');

    if (mobileSigninToggle) {
        mobileSigninToggle.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }

    if (mobileSignupToggle) {
        mobileSignupToggle.addEventListener('click', () => {
            container.classList.add('active');
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const formType = urlParams.get('form');
    const social = urlParams.get('social');

    if (formType === 'signup') container.classList.add('active');
    else container.classList.remove('active');

    // ✅ Social login session restore
    if (social) {
        try {
            const res = await fetch('/me', { credentials: 'include' });
            const data = await res.json();

            if (res.status === 200) {
                window.location.href = "/index.html";
            } else {
                console.error('❌ Not authenticated after social login');
            }
        } catch (err) {
            console.error('❌ Error fetching user after social login', err);
        }
    }

    // ✅ Signup Handler
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("🚀 Signup form submitted");

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            // Password validation
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                const oldError = document.querySelector('.error-message');
                if (oldError) oldError.remove();
                const oldSuccess = document.querySelector('.success-message');
                if (oldSuccess) oldSuccess.remove();

                const errorBox = document.createElement('div');
                errorBox.className = 'error-message';
                errorBox.innerText = 'Password must be at least 8 characters long and contain at least one letter, one number, and one special character.';
                document.querySelector('#signupForm').appendChild(errorBox);
                return;
            }

            try {
                const res = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                    credentials: 'include'
                });

                const data = await res.json();

                const oldError = document.querySelector('.error-message');
                if (oldError) oldError.remove();
                const oldSuccess = document.querySelector('.success-message');
                if (oldSuccess) oldSuccess.remove();

                if (res.status === 201) {
                    signupSuccessModal.style.display = 'flex';
                } else {
                    const errorBox = document.createElement('div');
                    errorBox.className = 'error-message';
                    errorBox.innerText = data.message || "Signup failed";
                    document.querySelector('#signupForm').appendChild(errorBox);
                }

            } catch (err) {
                console.error('❌ Signup error:', err);
                const oldError = document.querySelector('.error-message');
                if (oldError) oldError.remove();
                const oldSuccess = document.querySelector('.success-message');
                if (oldSuccess) oldSuccess.remove();

                const errorBox = document.createElement('div');
                errorBox.className = 'error-message';
                errorBox.innerText = 'Signup failed due to server error!';
                document.querySelector('#signupForm').appendChild(errorBox);
            }
        });
    }

    // ✅ Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("🚀 Login form submitted");

            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;

            try {
                const res = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                });

                const data = await res.json();

                const oldError = document.querySelector('.error-message');
                if (oldError) oldError.remove();
                const oldSuccess = document.querySelector('.success-message');
                if (oldSuccess) oldSuccess.remove();

                if (res.status === 200) {
                    const msg = document.createElement('div');
                    msg.className = 'success-message';
                    msg.innerText = 'Login successful!';
                    document.querySelector('#loginForm').appendChild(msg);

                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 2000);
                } else {
                    const errorBox = document.createElement('div');
                    errorBox.className = 'error-message';
                    errorBox.innerText = data.message || "Login failed";
                    document.querySelector('#loginForm').appendChild(errorBox);
                }

            } catch (err) {
                console.error('❌ Login error:', err);
                alert('Login failed due to server error!');
            }
        });
    }

    // 🔄 Auto-clear messages on input
    ['signinEmail', 'signinPassword', 'signupName', 'signupEmail', 'signupPassword'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                const oldError = document.querySelector('.error-message');
                if (oldError) oldError.remove();
                const oldSuccess = document.querySelector('.success-message');
                if (oldSuccess) oldSuccess.remove();
            });
        }
    });

    // 👁 Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const input = document.querySelector(icon.getAttribute('toggle'));
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });

    // Forgot Password Modal Logic
    document.querySelector('.forgot-link').addEventListener('click', () => {
      document.getElementById('forgotModal').style.display = 'flex';
    });

    document.getElementById('cancelForgot').addEventListener('click', () => {
      document.getElementById('forgotModal').style.display = 'none';
      document.getElementById('forgotEmail').value = '';
      document.getElementById('forgotMessage').innerText = '';
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.getElementById('forgotModal').style.display = 'none';
            document.getElementById('forgotEmail').value = '';
            document.getElementById('forgotMessage').innerText = '';
            signupSuccessModal.style.display = 'none';
        });
    });

    // Signup Success Modal OK Button
    if (okSignupBtn) {
        okSignupBtn.addEventListener('click', () => {
            signupSuccessModal.style.display = 'none';
            container.classList.remove('active');
        });
    }

    // Close Signup Success Modal
    document.querySelector('#signupSuccessModal .close').addEventListener('click', () => {
        signupSuccessModal.style.display = 'none';
        container.classList.remove('active');
    });
    // Forgot Password Submit Handler
    const submitForgotBtn = document.getElementById('submitForgot');
    const forgotEmailInput = document.getElementById('forgotEmail');
    const forgotMessage = document.getElementById('forgotMessage');

    if (submitForgotBtn) {
        submitForgotBtn.addEventListener('click', async () => {
            const email = forgotEmailInput.value;
            if (!email) {
                forgotMessage.innerText = 'Please enter your email';
                forgotMessage.style.color = '#e74c3c';
                return;
            }

            forgotMessage.innerText = 'Sending link...';
            forgotMessage.style.color = '#3498db';
            submitForgotBtn.disabled = true;

            try {
                const res = await fetch('/api/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();

                if (res.ok) {
                    forgotMessage.innerText = 'Reset link sent! Please check your email.';
                    forgotMessage.style.color = '#27ae60';
                    forgotEmailInput.value = '';
                    setTimeout(() => {
                        const modal = document.getElementById('forgotModal');
                        if (modal) modal.style.display = 'none';
                        forgotMessage.innerText = '';
                        submitForgotBtn.disabled = false;
                    }, 4000);
                } else {
                    forgotMessage.innerText = data.message || 'Failed to send reset link';
                    forgotMessage.style.color = '#e74c3c';
                    submitForgotBtn.disabled = false;
                }
            } catch (err) {
                forgotMessage.innerText = 'Server error. Please try again later.';
                forgotMessage.style.color = '#e74c3c';
                submitForgotBtn.disabled = false;
            }
        });
    }
});