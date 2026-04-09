// ========== UTILITY FUNCTIONS ========== //
function sanitize(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1001;
    `;
    messageElement.textContent = message;
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

function showError(message) {
    const errorElement = document.getElementById('error-display') || (() => {
        const el = document.createElement('div');
        el.id = 'error-display';
        el.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1001;
            max-width: 80%;
            text-align: center;
        `;
        document.body.appendChild(el);
        return el;
    })();

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showLoading(loading) {
    const loader = document.getElementById('loader');
    if (!loader && loading) {
        const l = document.createElement('div');
        l.id = 'loader';
        l.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            display: ${loading ? 'flex' : 'none'};
            justify-content: center;
            align-items: center;
            z-index: 1000;
            color: white;
            font-size: 1.2rem;
        `;
        l.innerHTML = `<div class="spinner"></div><div>Loading...</div>`;
        document.body.appendChild(l);
    } else if (loader) {
        loader.style.display = loading ? 'flex' : 'none';
    }
}

// ========== PROFILE DATA ========== //
async function loadProfileData() {
    try {
        showLoading(true);

        const urlParams = new URLSearchParams(window.location.search);
        const requestedUserId = urlParams.get('userId');

        // Fetch logged-in user's ID
        const loginRes = await fetch("/api/user/profile", { credentials: 'include' });
        if (!loginRes.ok) {
            const err = await loginRes.json();
            throw new Error(err.error || "Not authenticated");
        }
        const loginData = await loginRes.json();
        if (!loginData.success || !loginData.user) {
            throw new Error("Invalid profile data");
        }
        const loggedInUserId = loginData.user.id;

        // Determine which profile to load
        const profileUserId = requestedUserId || loggedInUserId;
        const isOwnProfile = !requestedUserId || parseInt(requestedUserId) === parseInt(loggedInUserId);
        
        // Always include the user ID in the request
        const profileUrl = `/api/user/profile?id=${profileUserId}`;

        // Fetch profile data and follow data in parallel
        const [profileRes, followData] = await Promise.all([
            fetch(profileUrl, { credentials: 'include' }),
            loadFollowerData(profileUserId)
        ]);

        if (!profileRes.ok) {
            const err = await profileRes.json();
            throw new Error(err.error || "Failed to load profile");
        }
        const userData = await profileRes.json();
        if (!userData.success || !userData.user || !Array.isArray(userData.blogs)) {
            throw new Error("Invalid profile data structure");
        }
        
        updateProfilePage(
            userData.user, 
            userData.blogs, 
            isOwnProfile, 
            loggedInUserId, 
            profileUserId,
            followData.followers,
            followData.following
        );

    } catch (err) {
        console.error("Error loading profile:", err);
        // ✅ Auth Wall: Redirect if not authenticated
        if (err.message === "Not authenticated") {
            window.location.href = '/blog-homepage/index.html?auth_required=true';
            return;
        }
        const profileContainer = document.querySelector(".profile-container");
        if (profileContainer) {
            profileContainer.innerHTML = '<p class="error">Failed to load profile.</p>';
        }
    } finally {
        showLoading(false);
    }
}

// ========== LOAD FOLLOWERS/FOLLOWING COUNTS ========== //
async function loadFollowerData(userId) {
    try {
        // If no userId provided, fetch current user's data
        let targetUserId = userId;
        if (!targetUserId) {
            const res = await fetch("/api/user/profile", { credentials: 'include' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to fetch user data");
            }
            const data = await res.json();
            if (!data.success || !data.user) {
                throw new Error("Invalid user data");
            }
            targetUserId = data.user.id;
        }

        // Fetch both followers and following in parallel
        const [followersRes, followingRes] = await Promise.all([
            fetch(`/api/user/followers?userId=${targetUserId}`, { credentials: 'include' }),
            fetch(`/api/user/following?userId=${targetUserId}`, { credentials: 'include' })
        ]);

        if (!followersRes.ok) {
            const err = await followersRes.json();
            throw new Error(err.error || "Failed to load followers");
        }
        if (!followingRes.ok) {
            const err = await followingRes.json();
            throw new Error(err.error || "Failed to load following");
        }

        const followers = await followersRes.json();
        const following = await followingRes.json();

        if (!followers.success || !Array.isArray(followers.followers) || 
            !following.success || !Array.isArray(following.following)) {
            throw new Error("Invalid follow data structure");
        }

        return {
            followers: followers.followers,
            following: following.following
        };

    } catch (err) {
        console.error("Follow data load error:", err);
        return { followers: [], following: [] };
    }
}

// ========== UI UPDATES ========== //
function updateProfilePage(user, blogs, isOwnProfile, loggedInUserId, profileUserId, followers, following) {
    if (!user) return;

    // Update basic info
    const userNameEl = document.getElementById("userName");
    if (userNameEl) {
        userNameEl.textContent = user.profileName || "User";
    }
    const userBioEl = document.getElementById("userBio");
    if (userBioEl) {
        userBioEl.textContent = user.bio || "No bio available.";
    }

    // Update profile image
    const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://remedy-backend-2lbx.onrender.com';

    const profileImg = document.querySelector('.profile-pic');
    if (profileImg) {
        const photoUrl = user.profileImage 
            ? (user.profileImage.startsWith('http') || user.profileImage.startsWith('data:') ? user.profileImage : BACKEND_URL + "/uploads/" + user.profileImage)
            : "/images/default.jpg";
        profileImg.src = photoUrl;
        profileImg.onerror = () => profileImg.src = "/images/default.jpg";
    }

    // Update social links
    const linkedinLink = document.getElementById("linkedinLink");
    if (linkedinLink) linkedinLink.href = user.linkedin || "#";
    const githubLink = document.getElementById("githubLink");
    if (githubLink) githubLink.href = user.github || "#";
    const twitterLink = document.getElementById("twitterLink");
    if (twitterLink) twitterLink.href = user.twitter || "#";

    // Update achievements
    const achievementsList = document.getElementById("achievementsList");
    if (achievementsList) {
        achievementsList.innerHTML = user.achievements 
            ? user.achievements.split(',').map(a => `<li>${sanitize(a)}</li>`).join('')
            : '<li>No achievements yet.</li>';
    }

    // Update blog count
    const blogCountEl = document.getElementById("blogCount");
    if (blogCountEl) {
        blogCountEl.textContent = blogs.length;
    }

    // Update followers/following counts
    const followerCountEl = document.getElementById("followerCount");
    if (followerCountEl) {
        followerCountEl.textContent = followers.length;
    }
    const followingCountEl = document.getElementById("followingCount");
    if (followingCountEl) {
        followingCountEl.textContent = following.length;
    }
    
    // Only show follow button if viewing someone else's profile
    if (!isOwnProfile) {
        const isFollowing = followers.some(u => u.id === parseInt(loggedInUserId));
        updateFollowButton(isFollowing);
    }

    // Create "Edit Profile" button only for own profile
    const editProfileContainer = document.getElementById("editProfileContainer");
    if (isOwnProfile && editProfileContainer) {
        if (!editProfileContainer.querySelector('.edit-profile')) {
            const editBtn = document.createElement("button");
            editBtn.className = "edit-profile";
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
            editBtn.onclick = () => {
                window.location.href = '/blog-homepage/blog-profilepage/blog-editpage/index.html';
            };
            editProfileContainer.appendChild(editBtn);
        }
    }

    // Create "Create New Blog" button
    const createBtnContainer = document.getElementById("createBlogBtnContainer");
    if (isOwnProfile && createBtnContainer) {
        if (!createBtnContainer.querySelector('.create-blog-btn')) {
            const createBtn = document.createElement("button");
            createBtn.className = "create-blog-btn";
            createBtn.innerHTML = '<i class="fas fa-plus"></i> Create New Blog';
            createBtn.onclick = () => {
                window.location.href = '/blog-homepage/blog-profilepage/create-blog/index.html';
            };
            createBtnContainer.appendChild(createBtn);
        }
    }

    const blogList = document.getElementById("blogList");
    if (!blogList) return;

    blogList.innerHTML = "";

    if (blogs.length === 0) {
        const noBlog = document.createElement("p");
        noBlog.textContent = "No blogs found.";
        blogList.appendChild(noBlog);
        return;
    }

    // Render blogs
    blogs.forEach((blog, index) => {
        const blogItem = document.createElement("li");
        blogItem.className = "blog-item";
        blogItem.innerHTML = `
            <div class="blog-header">
                <h3>${sanitize(blog.title || 'Untitled')}</h3>
                <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                ${isOwnProfile ? `
                <div class="blog-actions">
                    <i class="fas fa-edit action-icon" onclick="handleEditClick(event, '${blog.id}')"></i>
                    <i class="fas fa-trash-alt action-icon" onclick="handleDeleteClick(event, '${blog.id}')"></i>
                </div>
                ` : ''}
            </div>
            <p>${sanitize(blog.content ? blog.content.substring(0, 100) : 'No content')}...</p>
        `;
        
        blogItem.onclick = (e) => {
            if (e.target.classList.contains('action-icon') || 
                e.target.parentElement.classList.contains('blog-actions')) {
                return;
            }
            window.location.href = `/blog-homepage/readmore/index.html?blogId=${encodeURIComponent(blog.id)}`;
        };
        
        blogList.appendChild(blogItem);
    });
}

function updateFollowButton(isFollowing) {
    const profilePicWrapper = document.querySelector(".profile-pic-wrapper");
    const existingBtn = document.getElementById("followToggleBtn");
    
    if (!existingBtn) {
        const followBtn = document.createElement("button");
        followBtn.id = "followToggleBtn";
        followBtn.className = isFollowing ? "following" : "";
        followBtn.textContent = isFollowing ? "Following" : "Follow";
        profilePicWrapper.appendChild(followBtn);
    } else {
        existingBtn.textContent = isFollowing ? "Following" : "Follow";
        existingBtn.className = isFollowing ? "following" : "";
    }
}

// ========== BLOG ACTIONS ========== //
window.handleEditClick = function(event, blogId) {
    event.stopPropagation();
    window.location.href = `/blog-homepage/blog-profilepage/create-blog/index.html?blogId=${encodeURIComponent(blogId)}`;
};

window.handleDeleteClick = async function(event, blogId) {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
        showLoading(true);
        const response = await fetch(`/api/user/blogs/${encodeURIComponent(blogId)}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Delete failed');
        }

        showMessage("Blog deleted successfully!");
        loadProfileData();
    } catch (err) {
        console.error("Delete error:", err);
        showError(err.message || "Something went wrong.");
    } finally {
        showLoading(false);
    }
};

// ========== FOLLOWERS/FOLLOWING MODAL ========== //
async function showFollowersList() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get('userId');
        
        if (!userId) {
            const res = await fetch("/api/user/profile", { credentials: 'include' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to fetch user data");
            }
            const data = await res.json();
            if (!data.success || !data.user) {
                throw new Error("Invalid user data");
            }
            userId = data.user.id;
        }

        const response = await fetch(`/api/user/followers?userId=${userId}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to load followers");
        }
        const data = await response.json();
        if (!data.success || !Array.isArray(data.followers)) {
            throw new Error("Invalid followers data");
        }
        
        const modal = document.getElementById("followModal");
        const titleEl = document.getElementById("modalTitle");
        const listEl = document.getElementById("modalList");

        const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:5000' 
            : 'https://remedy-backend-2lbx.onrender.com';

        titleEl.textContent = "Followers";
        listEl.innerHTML = data.followers.length > 0 
            ? data.followers.map(user => {
                const avatar = user.image 
                    ? (user.image.startsWith('http') || user.image.startsWith('data:') ? user.image : BACKEND_URL + "/uploads/" + user.image)
                    : '/images/default.jpg';
                return `
                <div class="user-item" onclick="window.location.href='/blog-homepage/blog-profilepage/index.html?userId=${user.id}'">
                    <img src="${avatar}" class="user-avatar" onerror="this.src='/images/default.jpg'">
                    <span class="user-name">${user.name || 'User'}</span>
                </div>
            `}).join('')
            : '<p>No followers found</p>';

        modal.style.display = "block";
    } catch (err) {
        showError(err.message || "Failed to load followers");
    }
}

async function showFollowingList() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get('userId');
        
        if (!userId) {
            const res = await fetch("/api/user/profile", { credentials: 'include' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to fetch user data");
            }
            const data = await res.json();
            if (!data.success || !data.user) {
                throw new Error("Invalid user data");
            }
            userId = data.user.id;
        }

        const response = await fetch(`/api/user/following?userId=${userId}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to load following");
        }
        const data = await response.json();
        if (!data.success || !Array.isArray(data.following)) {
            throw new Error("Invalid following data");
        }
        
        const modal = document.getElementById("followModal");
        const titleEl = document.getElementById("modalTitle");
        const listEl = document.getElementById("modalList");

        const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:5000' 
            : 'https://remedy-backend-2lbx.onrender.com';

        titleEl.textContent = "Following";
        listEl.innerHTML = data.following.length > 0 
            ? data.following.map(user => {
                const avatar = user.image 
                    ? (user.image.startsWith('http') || user.image.startsWith('data:') ? user.image : BACKEND_URL + "/uploads/" + user.image)
                    : '/images/default.jpg';
                return `
                <div class="user-item" onclick="window.location.href='/blog-homepage/blog-profilepage/index.html?userId=${user.id}'">
                    <img src="${avatar}" class="user-avatar" onerror="this.src='/images/default.jpg'">
                    <span class="user-name">${user.name || 'User'}</span>
                </div>
            `}).join('')
            : '<p>Not following anyone</p>';

        modal.style.display = "block";
    } catch (err) {
        showError(err.message || "Failed to load following list");
    }
}

function closeModal() {
    const modal = document.getElementById("followModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// ========== TOGGLE FOLLOW ========== //
document.addEventListener("click", async function(e) {
    if (e.target.id === "followToggleBtn") {
        const btn = e.target;
        const userId = new URLSearchParams(window.location.search).get('userId');
        const isFollowing = btn.classList.contains("following");

        try {
            showLoading(true);
            const url = `/api/user/${isFollowing ? 'unfollow' : 'follow'}/${userId}`;
            const response = await fetch(url, { 
                method: 'POST', 
                credentials: 'include' 
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update follow status");
            }

            // Update button state
            btn.textContent = isFollowing ? 'Follow' : 'Following';
            btn.classList.toggle('following');

            // Update follower count
            const followerCountEl = document.getElementById("followerCount");
            const currentCount = parseInt(followerCountEl.textContent) || 0;
            followerCountEl.textContent = isFollowing ? currentCount - 1 : currentCount + 1;

            showMessage(isFollowing ? "Unfollowed successfully!" : "Followed successfully!");

            // Refresh follow data
            loadProfileData();

        } catch (err) {
            console.error("Follow error:", err);
            showError(err.message || "Something went wrong.");
        } finally {
            showLoading(false);
        }
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("followModal");
    if (modal && event.target === modal) {
        modal.style.display = "none";
    }
};

// ========== INITIALIZATION ========== //
document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
    `;
    document.head.appendChild(style);

    loadProfileData();
});