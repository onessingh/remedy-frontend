// ========== GLOBAL STATE ========== //
let isLoading = false;
const LOADER_DELAY = 300; // Minimum loader display time in ms

// ========== LOADER MANAGEMENT ========== //
function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 1000;
        backdrop-filter: blur(2px);
    `;
    loader.innerHTML = `
        <div class="spinner" style="
            border: 4px solid rgba(0,0,0,0.1);
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        "></div>
        <div style="font-size: 1.2rem; color: #333;">Loading...</div>
    `;
    document.body.appendChild(loader);
    return loader;
}

function showLoading(show) {
    const loader = document.getElementById('loader') || createLoader();
    
    if (show) {
        isLoading = true;
        loader.style.display = 'flex';
        document.querySelectorAll('input, textarea, button').forEach(el => {
            el.disabled = true;
        });
    } else {
        // Minimum display time for better UX
        setTimeout(() => {
            isLoading = false;
            loader.style.display = 'none';
            document.querySelectorAll('input, textarea, button').forEach(el => {
                el.disabled = false;
            });
        }, LOADER_DELAY);
    }
}

// ========== NOTIFICATION SYSTEM ========== //
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ff4444' : '#4CAF50'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1001;
        animation: fadeIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== IMAGE HANDLING ========== //
function setupImageUpload(profileImg) {
    const fileInput = document.getElementById('profilePicture');
    if (!fileInput) return;

    fileInput.addEventListener('change', async function(e) {
        if (isLoading) return;
        
        const file = e.target.files[0];
        if (!file) return;

        try {
            showLoading(true);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImg.src = e.target.result;
                showLoading(false);
            };
            reader.onerror = () => {
                throw new Error('Failed to read image file');
            };
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('Image upload error:', error);
            showNotification(error.message || 'Error processing image', 'error');
            showLoading(false);
        }
    });
}

// ========== PROFILE SAVE FUNCTION ========== //
async function saveProfile() {
    if (isLoading) return;
    
    const saveBtn = document.getElementById('saveProfile');
    if (!saveBtn) return;

    const originalText = saveBtn.textContent;
    const startTime = Date.now();
    
    try {
        // Update UI immediately
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        showLoading(true);

        // Prepare form data
        const formData = new FormData();
        const fields = [
            { id: 'name', key: 'profileName' },
            { id: 'aboutMe', key: 'bio' },
            { id: 'achievements', key: 'achievements' },
            { id: 'linkedin', key: 'linkedin' },
            { id: 'github', key: 'github' },
            { id: 'twitter', key: 'twitter' }
        ];

        fields.forEach(({ id, key }) => {
            const element = document.getElementById(id);
            if (element && element.value.trim()) {
                formData.append(key, element.value.trim());
            }
        });

        // Handle image upload
        const fileInput = document.getElementById('profilePicture');
        if (fileInput?.files[0]) {
            formData.append('profileImage', fileInput.files[0]);
        }

        // Send to server
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            credentials: 'include',
            body: formData
        });

        // Calculate remaining minimum loading time
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, LOADER_DELAY - elapsed);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Save failed');
        }

        // Wait for minimum loading time if needed
        await new Promise(resolve => setTimeout(resolve, remainingDelay));

        showNotification('Profile saved successfully!');
        
        // Redirect with cache busting
        window.location.href = "/blog-homepage/blog-profilepage/index.html";
    } catch (error) {
        console.error('Save error:', error);
        showNotification(error.message || 'Error saving profile', 'error');
    } finally {
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        showLoading(false);
    }
}

// ========== INITIALIZATION ========== //
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
    `;
    document.head.appendChild(style);

    // Initialize image upload
    setupImageUpload(document.getElementById('profilePreview'));

    // Set up save button
    const saveBtn = document.getElementById('saveProfile');
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            saveProfile();
        });
    }

    // Load profile data
    (async function loadCurrentProfile() {
        try {
            showLoading(true);
            const startTime = Date.now();
            
            const response = await fetch('/api/user/profile', { 
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.status === 401) {
                window.location.href = '/signin-page/signin.html';
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to load profile');
            }

            // Set form values
            const { user } = data;
            const fields = {
                'name': user.profileName || '',
                'aboutMe': user.bio || '',
                'achievements': user.achievements || '',
                'linkedin': user.linkedin || '',
                'github': user.github || '',
                'twitter': user.twitter || ''
            };

            Object.entries(fields).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) element.value = value;
            });

            const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:5000' 
                : 'https://remedy-backend-2lbx.onrender.com';

            // Set profile image
            const profileImg = document.getElementById('profilePreview');
            if (profileImg) {
                profileImg.src = user.profileImage 
                    ? (user.profileImage.startsWith('http') || user.profileImage.startsWith('data:') ? user.profileImage : BACKEND_URL + "/uploads/" + user.profileImage)
                    : '/images/default.jpg';
            }

            // Calculate remaining minimum loading time
            const elapsed = Date.now() - startTime;
            const remainingDelay = Math.max(0, LOADER_DELAY - elapsed);
            await new Promise(resolve => setTimeout(resolve, remainingDelay));

        } catch (error) {
            console.error('Profile load error:', error);
            showNotification(error.message || 'Error loading profile', 'error');
        } finally {
            showLoading(false);
        }
    })();
});