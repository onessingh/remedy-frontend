document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    // 🧠 Hybrid Navigation Logic
    // 1. Mobile Inner-Panel Team Discovery Slider
    const discoverButtons = document.querySelectorAll('.discover-button');
    const backButtons = document.querySelectorAll('.back-button');

    discoverButtons.forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.form-container');
            if (panel) panel.classList.add('show-team');
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.form-container');
            if (panel) panel.classList.remove('show-team');
        });
    });

    // 2. Desktop Global Sliding Overlay
    const detailsButton = document.getElementById('detailsButton');
    const container = document.getElementById('container');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayDescription = document.getElementById('overlayDescription');
    const desktopBlogTeam = document.querySelector('.desktop-blog-team');
    const desktopRemedyTeam = document.querySelector('.desktop-remedy-team');

    if (detailsButton && container) {
        let showingRemedy = false;
        detailsButton.addEventListener('click', function () {
            container.classList.toggle('show-blog');
            
            // Toggle overlay text and team visibility (Desktop only logic)
            setTimeout(() => {
                if (!showingRemedy) {
                    overlayTitle.textContent = 'Home Remedy';
                    overlayDescription.textContent = 'Discover natural remedies for common health issues.';
                    detailsButton.textContent = 'Back to Blogs';
                    if (desktopBlogTeam) desktopBlogTeam.style.display = 'none';
                    if (desktopRemedyTeam) desktopRemedyTeam.style.display = 'grid';
                } else {
                    overlayTitle.textContent = 'Discover Blogs';
                    overlayDescription.textContent = 'Explore blogs covering health, lifestyle, and wellness.';
                    detailsButton.textContent = 'Details';
                    if (desktopBlogTeam) desktopBlogTeam.style.display = 'grid';
                    if (desktopRemedyTeam) desktopRemedyTeam.style.display = 'none';
                }
                showingRemedy = !showingRemedy;
            }, 300);
        });
    }

    // 🧠 Profile/Login/Logout Part
    const userIcon = document.getElementById('userIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const loginLink = document.getElementById('loginLink');
    const createAccountLink = document.getElementById('createAccountLink');
    const loggedInInfo = document.getElementById('loggedInInfo');
    const userName = document.getElementById('userName');
    const logoutLink = document.getElementById('logoutLink');
    const dropdownProfilePic = document.querySelector('.dropdown-profile-pic');
    const manageProfileLink = document.getElementById('manageProfileLink');
    const manageProfileSection = document.getElementById('manageProfileSection');
    const showPasswordChangeBtn = document.getElementById('showPasswordChangeBtn');
    const passwordChangeSection = document.getElementById('passwordChangeSection');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const defaultIcon = 'images/blankphoto.png';
    const mockUserName = 'Guest';

    async function updateProfileUI() {
        try {
            const res = await fetch('/api/user', {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Not authenticated');

            const data = await res.json();
            const photoUrl = data.photo ? "/uploads/" + data.photo : defaultIcon;

            // Update UI with user data
            userIcon.src = photoUrl;
            dropdownProfilePic.src = photoUrl;
            userName.textContent = data.name || 'Guest';

            // 👇 New line added: Update previewPhoto in Manage Profile Section
            const previewPhoto = document.getElementById("previewPhoto");
            if (previewPhoto) {
                previewPhoto.src = photoUrl;
            }

            // Save email for forgot password
            const userEmailSpan = document.getElementById("userEmail");
            if (userEmailSpan) {
                userEmailSpan.textContent = data.email || '';
            }

            // Show logged-in state
            loginLink.style.display = "none";
            createAccountLink.style.display = "none";
            loggedInInfo.style.display = "flex";
            logoutLink.style.display = "block";
            manageProfileLink.style.display = "block";

        } catch (error) {
            console.error('Auth check failed:', error);
            // Fallback to logged-out state
            userIcon.src = defaultIcon;
            dropdownProfilePic.src = defaultIcon;
            userName.textContent = mockUserName;

            loginLink.style.display = "block";
            createAccountLink.style.display = "block";
            loggedInInfo.style.display = "none";
            logoutLink.style.display = "none";
            manageProfileLink.style.display = "none";
        }
    }
      
    function logout() {
        fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            showToast('Logged out successfully!', 'success');
            setTimeout(() => window.location.href = '/index.html', 1500);
        });
    }

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    updateProfileUI();

    if (userIcon && profileDropdown) {
        userIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            profileDropdown.classList.toggle('show');
            manageProfileSection.style.display = "none";
        });

        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();
            logout();
        });

        document.addEventListener('click', function (event) {
            if (!userIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.remove('show');
                if (manageProfileSection && manageProfileSection.style.display === 'block') {
                    manageProfileSection.style.display = 'none';
                    if (loggedInInfo) loggedInInfo.style.display = 'flex';
                }
            }
        });
    }

    if (manageProfileLink) {
        manageProfileLink.addEventListener('click', function (e) {
            e.preventDefault();
            const isVisible = manageProfileSection.style.display === 'block';
            manageProfileSection.style.display = isVisible ? 'none' : 'block';
            if (loggedInInfo) {
                loggedInInfo.style.display = isVisible ? 'flex' : 'none';
            }
        });
    }

    if (showPasswordChangeBtn) {
        showPasswordChangeBtn.addEventListener("click", function () {
            if (passwordChangeSection.style.display === "block") {
                passwordChangeSection.style.display = "none";
                document.getElementById("newName").style.display = "block";
                document.getElementById("imageWrapper").style.display = "inline-block";
                if (saveProfileBtn) saveProfileBtn.style.display = "inline-block";
            } else {
                document.getElementById("newName").style.display = "none";
                document.getElementById("newPhoto").style.display = "none";
                document.getElementById("imageWrapper").style.display = "none";
                if (saveProfileBtn) saveProfileBtn.style.display = "none";
                passwordChangeSection.style.display = "block";
            }
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', async () => {
            const newName = document.getElementById('newName').value.trim();
            const photoFile = document.getElementById('newPhoto').files[0];
            const formData = new FormData();
            formData.append('name', newName || userName.textContent);
            if (photoFile) formData.append('photo', photoFile);
            try {
                const res = await fetch('/profile/update-profile', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.status === 200) {
                    showToast('Profile updated successfully!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showToast(data.message, 'error');
                }
            } catch (err) {
                console.error('Update profile error:', err);
                showToast('Something went wrong!', 'error');
            }
        });
    }

    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', async () => {
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match!', 'error');
                return;
            }
            try {
                const res = await fetch('/profile/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ oldPassword, newPassword }),
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.status === 200) {
                    showToast('Password changed successfully!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showToast(data.message, 'error');
                }
            } catch (err) {
                console.error('Change password error:', err);
                showToast('Something went wrong!', 'error');
            }
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const userEmail = document.getElementById("userEmail").textContent.trim();
            if (!userEmail) {
                showToast('User email not found!', 'error');
                return;
            }
            try {
                const res = await fetch('/profile/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail }),
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.status === 200) {
                    showToast('Password reset email sent!', 'success');
                } else {
                    showToast(data.message, 'error');
                }
            } catch (err) {
                console.error('Forgot password error:', err);
                showToast('Something went wrong!', 'error');
            }
        });
    }

    // Image preview on upload
    const newPhotoInput = document.getElementById("newPhoto");
    const previewPhoto = document.getElementById("previewPhoto");

    if (newPhotoInput && previewPhoto) {
        newPhotoInput.addEventListener("change", function () {
    const file = newPhotoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewPhoto.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
    }
});