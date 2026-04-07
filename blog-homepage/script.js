let header = document.querySelector("header");
let allPosts = []; // Moved to global scope
let locationFilterValue = ''; // Moved to global scope

window.addEventListener("scroll", () => {
    header.classList.toggle("shadow", window.scrollY > 0);
});

const menuToggle = document.querySelector('.menu-toggle');
const navRight = document.querySelector('.nav-right');
const navOverlay = document.querySelector('.nav-overlay');

const closeMenu = () => {
    navRight.classList.remove('active');
    navOverlay.classList.remove('active');
    const menuIcon = menuToggle.querySelector('i');
    if (menuIcon) menuIcon.classList.remove('bx-x');
};

menuToggle.addEventListener('click', () => {
    const isActive = navRight.classList.toggle('active');
    navOverlay.classList.toggle('active', isActive);
    const menuIcon = menuToggle.querySelector('i');
    if (menuIcon) menuIcon.classList.toggle('bx-x', isActive);
});

// IMPORTANT: Stop propagation inside the sidebar so it doesn't close when clicked
navRight.addEventListener('click', (e) => {
    e.stopPropagation();
});

navOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

const profileDropdown = document.querySelector('.profile-dropdown');
const profileIconTrigger = document.querySelector('.profile-icon');
const notificationIcon = document.querySelector('.notification-icon');
const notificationCount = document.querySelector('.notification-count');
let notificationDropdown = document.querySelector('.notification-dropdown');

if (!notificationDropdown) {
    notificationDropdown = document.createElement('div');
    notificationDropdown.className = 'notification-dropdown';
    // Append it to navRight instead of body for mobile flow
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
        navRight.appendChild(notificationDropdown);
    } else {
        document.body.appendChild(notificationDropdown);
    }
}

const handleDropdownToggle = (dropdownToOpen, dropdownToClose) => {
    return function(e) {
        e.stopPropagation();
        // Always close the other dropdown
        dropdownToClose.classList.remove('active');
        // Toggle the target one
        dropdownToOpen.classList.toggle('active');
        
        if (dropdownToOpen === notificationDropdown && dropdownToOpen.classList.contains('active')) {
            markAllNotificationsAsRead();
        }
    };
};

notificationIcon.addEventListener('click', handleDropdownToggle(notificationDropdown, profileDropdown));
profileIconTrigger.addEventListener('click', handleDropdownToggle(profileDropdown, notificationDropdown));

document.addEventListener('click', function() {
    notificationDropdown.classList.remove('active');
    profileDropdown.classList.remove('active');
});

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
        profileDropdown.classList.remove('active');
    });
});

function loadNotifications() {
    fetch('/api/user/notifications/unread-count')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const unreadCount = data.unreadCount;
                notificationCount.textContent = unreadCount > 9 ? '9+' : unreadCount;
                notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
            }
        })
        .catch(err => console.error('Error fetching notification count:', err));

    const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://remedy-backend-2lbx.onrender.com';

    fetch('/api/user/notifications?limit=5')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                notificationDropdown.innerHTML = '';
                
                if (data.notifications.length === 0) {
                    notificationDropdown.innerHTML = '<div class="notification-item">No notifications</div>';
                } else {
                    data.notifications.forEach(notif => {
                        const notifItem = document.createElement('div');
                        notifItem.className = `notification-item ${notif.isRead ? '' : 'unread'}`;
                        
                        let message = '';
                        if (notif.type === 'like') {
                            message = `liked your blog <a href="/blog-homepage/readmore/index.html?blogId=${notif.reference_id}">${notif.blogTitle || 'your post'}</a>`;
                        } else if (notif.type === 'follow') {
                            message = `started following you`;
                        } else if (notif.type === 'comment') {
                            message = `commented on your blog <a href="/blog-homepage/readmore/index.html?blogId=${notif.reference_id}#comments">${notif.blogTitle || 'your post'}</a>`;
                        } else if (notif.type === 'newsletter') {
                            message = notif.message && notif.message.includes('unsubscribed') ? 
                                `unsubscribed from newsletter` : 
                                `subscribed to newsletter updates`;
                        }
                        
                        notifItem.innerHTML = `
                            <div class="notification-content">
                                <a href="/blog-homepage/blog-profilepage/index.html?userId=${notif.actor_id}">
                                    <img src="${notif.profileImage ? (notif.profileImage.startsWith('http') ? notif.profileImage : BACKEND_URL + "/uploads/" + notif.profileImage) : '/images/default.jpg'}" alt="Profile" class="notification-avatar">
                                </a>
                                <div class="notification-text">
                                    <a href="/blog-homepage/blog-profilepage/index.html?userId=${notif.actor_id}" style="font-weight:600">${notif.profileName || 'Anonymous'}</a> ${message}
                                    <div class="notification-time">
                                        ${formatTime(notif.created_at)}
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        notificationDropdown.appendChild(notifItem);
                    });
                    
                    const viewAll = document.createElement('a');
                    viewAll.className = 'view-all-notifications';
                    viewAll.href = '/blog-homepage/notifications.html';
                    viewAll.textContent = 'View All Notifications';
                    notificationDropdown.appendChild(viewAll);
                }
            }
        })
        .catch(err => console.error('Error loading notifications:', err));
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

function markAllNotificationsAsRead() {
    fetch('/api/user/notifications/mark-all-read', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelectorAll('.notification-item').forEach(item => {
                    item.classList.remove('unread');
                });
                notificationCount.style.display = 'none';
            }
        })
        .catch(err => console.error('Error marking notifications as read:', err));
}

function filterPosts(filter = "all") {
    const postContainer = $(".post-container");
    postContainer.empty();

    let filteredPosts = allPosts.filter(post => {
        if (filter === "all") return true;
        if (filter === "location") {
            return locationFilterValue && post.location && post.location.toLowerCase().includes(locationFilterValue);
        }
        return post.category && post.category.toLowerCase() === filter;
    });

    if (filteredPosts.length === 0) {
        postContainer.html('<p>No posts found.</p>');
    } else {
        filteredPosts.forEach(post => renderUniqueUserPost(post));
    }
}

$(document).ready(function () {
    fetch('/api/user/blogs/recent')
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.error || `Failed to fetch recent blogs (Status: ${res.status})`);
                });
            }
            return res.json();
        })
        .then(posts => {
            if (!Array.isArray(posts)) {
                throw new Error('Expected an array of posts');
            }
            allPosts = posts;
            const postContainer = document.querySelector(".post-container");
            if (postContainer && posts.length === 0) {
                postContainer.innerHTML = '<p>No recent posts available.</p>';
            }
            posts.forEach(post => renderUniqueUserPost(post));
        })
        .catch(err => {
            console.error("Failed to load posts:", err);
            const postContainer = document.querySelector(".post-container");
            if (postContainer) {
                postContainer.innerHTML = '<p class="error">Failed to load posts. Please try again later.</p>';
            }
        });

    $(".filter-item").click(function () {
        const filter = $(this).attr("data-filter");
        if (filter === "location") {
            const locationInput = prompt("Enter location to filter by (e.g., New York):");
            if (locationInput && locationInput.trim()) {
                locationFilterValue = locationInput.trim().toLowerCase();
                filterPosts('location');
                $(this).text(`Location: ${locationFilterValue}`).addClass("active-filter").siblings().removeClass("active-filter");
            } else {
                locationFilterValue = '';
                $(this).text('Location').removeClass("active-filter");
            }
        } else {
            locationFilterValue = '';
            filterPosts(filter);
            $(this).addClass("active-filter").siblings().removeClass("active-filter");
            if (filter === "all") {
                $(".filter-item[data-filter='location']").text("Location");
            }
        }
    });

    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        const query = $("#searchQuery").val().trim();
        const searchType = $("#searchType").val();
        
        if (!query) {
            alert("Please enter a search term");
            return;
        }
        
        if (!['all', 'location', 'category', 'user'].includes(searchType)) {
            alert("Invalid search type");
            return;
        }
        
        window.location.href = `search-results.html?query=${encodeURIComponent(query)}&type=${searchType}`;
    });
});

AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function checkLoginStatus(callback) {
    fetch("/api/check-auth")
        .then(res => res.json())
        .then(data => callback(data.loggedIn))
        .catch(err => {
            console.error("Auth check error:", err);
            callback(false);
        });
}

checkLoginStatus(function(isLoggedIn) {
    if (isLoggedIn) {
        loadNotifications();
        setInterval(loadNotifications, 30000);
    } else {
        notificationIcon.style.display = 'none';
    }
});

notificationIcon.addEventListener('click', function(e) {
    checkLoginStatus(function(isLoggedIn) {
        if (!isLoggedIn) {
            e.preventDefault();
            showLoginPrompt();
        }
    });
});

function showLoginPrompt() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.backdropFilter = "blur(4px)";
    overlay.style.zIndex = "9998";
    overlay.style.transition = "opacity 0.3s ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.opacity = "1", 10);

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%) scale(0.8)";
    modal.style.backgroundColor = "#fff";
    modal.style.padding = "25px 30px";
    modal.style.borderRadius = "12px";
    modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
    modal.style.zIndex = "9999";
    modal.style.textAlign = "center";
    modal.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    modal.style.opacity = "0";
    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);

    modal.innerHTML = `
        <h3 style="margin-bottom: 15px; font-family: 'Segoe UI', sans-serif;">🔒 Authentication Required</h3>
        <p style="margin-bottom: 20px; color: #555;">You need to login first to access this feature.</p>
        <button id="goToLoginBtn" style="
            padding: 10px 20px;
            margin-right: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s ease;
            font-weight: 500;
        ">Go to Login Page</button>
        <button id="cancelBtn" style="
            padding: 10px 20px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s ease;
            font-weight: 500;
        ">Cancel</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    document.getElementById("goToLoginBtn").addEventListener("click", () => {
        window.location.href = "/signin-page/signin.html";
    });

    document.getElementById("cancelBtn").addEventListener("click", () => {
        closeModal(modal, overlay);
    });

    overlay.addEventListener("click", () => {
        closeModal(modal, overlay);
    });
}

function closeModal(modal, overlay) {
    modal.style.opacity = "0";
    modal.style.transform = "translate(-50%, -50%) scale(0.8)";
    overlay.style.opacity = "0";

    setTimeout(() => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    }, 300);
}

document.addEventListener("DOMContentLoaded", function () {
    const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://remedy-backend-2lbx.onrender.com';

    fetch("/api/user/profile")
        .then(res => {
            if (!res.ok) {
                throw new Error(`Profile fetch failed: ${res.status}`);
            }
            return res.json();
        })
        .then(userData => {
            if (userData && userData.user) {
                const user = userData.user;
                const profileImageEl = document.getElementById("header-profile-image");
                const profileNameEl = document.getElementById("header-profile-name");

                if (profileImageEl) {
                    profileImageEl.src = user.profileImage 
                        ? (user.profileImage.startsWith('http') ? user.profileImage : BACKEND_URL + "/uploads/" + user.profileImage)
                        : "/images/default.jpg";
                    profileImageEl.onerror = () => profileImageEl.src = "/images/default.jpg";
                }

                if (profileNameEl) {
                    profileNameEl.textContent = user.profileName || "User";
                }
            }
        })
        .catch(err => {
            console.error("Failed to load profile info:", err);
            const profileImageEl = document.getElementById("header-profile-image");
            if (profileImageEl) profileImageEl.src = "/images/default.jpg";
        });

    const createBlogBtn = document.getElementById("createBlogBtn");
    const profileBtn = document.getElementById("profileBtn");

    [createBlogBtn, profileBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                checkLoginStatus(function (isLoggedIn) {
                    if (!isLoggedIn) {
                        showLoginPrompt();
                    } else {
                        window.location.href = btn.getAttribute("href");
                    }
                });
            });
        }
    });

    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
        checkSubscriptionStatus();

        newsletterForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.trim() : null;
            
            if (!email) {
                showError("Please enter a valid email address");
                return;
            }

            try {
                const authResponse = await fetch('/api/check-auth');
                if (!authResponse.ok) {
                    throw new Error("Auth check failed");
                }
                const authData = await authResponse.json();
                
                if (authData.loggedIn) {
                    const userResponse = await fetch('/api/user');
                    if (!userResponse.ok) {
                        throw new Error("User data fetch failed");
                    }
                    const userData = await userResponse.json();
                    
                    if (userData.email !== email) {
                        showError("You can only subscribe with your registered email");
                        return;
                    }
                }

                const isSubscribed = await checkServerSubscriptionStatus(email, authData.loggedIn ? authData.user?.id : null);
                
                if (isSubscribed) {
                    await unsubscribeFromNewsletter(email, authData.loggedIn ? authData.user?.id : null);
                } else {
                    await subscribeToNewsletter(email, authData.loggedIn ? authData.user?.id : null);
                }
            } catch (err) {
                showError("❌ " + (err.message || 'Operation failed'));
            }
        });
    }
});

async function checkSubscriptionStatus() {
    const newsletterForm = document.querySelector(".newsletter-form");
    if (!newsletterForm) return;

    try {
        const authResponse = await fetch('/api/check-auth');
        if (!authResponse.ok) {
            throw new Error("Auth check failed");
        }
        const authData = await authResponse.json();
        
        if (authData.loggedIn) {
            const email = authData.user.email;
            const isSubscribed = await checkServerSubscriptionStatus(email, authData.user.id);
            
            if (isSubscribed) {
                showSubscribedState(email);
            } else {
                showUnsubscribedState();
            }
        } else {
            showUnsubscribedState();
            localStorage.removeItem('subscribedEmail');
        }
    } catch (err) {
        console.error("Error checking subscription status:", err);
        showUnsubscribedState();
    }
}

async function checkServerSubscriptionStatus(email, userId) {
    try {
        const response = await fetch(`/api/user/newsletter/check?email=${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': userId ? `Bearer ${localStorage.getItem('token')}` : ''
            }
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to check subscription");
        }
        const data = await response.json();
        return data.success && data.isSubscribed;
    } catch (err) {
        console.error("Error checking subscription:", err);
        return false;
    }
}

async function subscribeToNewsletter(email, userId) {
    try {
        const response = await fetch('/api/user/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userId ? `Bearer ${localStorage.getItem('token')}` : ''
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Subscription failed');
        }

        const data = await response.json();
        if (data.success) {
            if (!userId) {
                localStorage.setItem('subscribedEmail', email);
            }
            showSubscribedState(email);
        }
    } catch (err) {
        showError("❌ " + err.message);
        throw err;
    }
}

async function unsubscribeFromNewsletter(email, userId) {
    try {
        const response = await fetch('/api/user/newsletter/unsubscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userId ? `Bearer ${localStorage.getItem('token')}` : ''
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Unsubscription failed');
        }

        const data = await response.json();
        if (data.success) {
            if (!userId) {
                localStorage.removeItem('subscribedEmail');
            }
            showUnsubscribedState();
        }
    } catch (err) {
        showError("❌ " + err.message);
        throw err;
    }
}

function showSubscribedState(email) {
    const newsletterForm = document.querySelector(".newsletter-form");
    if (!newsletterForm) return;
    
    newsletterForm.innerHTML = `
        <div class="subscribed-message">
            <p>✅ You're subscribed to our newsletter! (${email})</p>
            <button type="button" id="unsubscribeBtn" class="unsubscribe-btn">
                Unsubscribe
            </button>
        </div>
    `;

    document.getElementById("unsubscribeBtn").addEventListener("click", async function() {
        try {
            const authResponse = await fetch('/api/check-auth');
            if (!authResponse.ok) {
                throw new Error("Auth check failed");
            }
            const authData = await authResponse.json();
            await unsubscribeFromNewsletter(email, authData.loggedIn ? authData.user?.id : null);
        } catch (err) {
            showError("❌ " + err.message);
        }
    });
}

function showUnsubscribedState() {
    const newsletterForm = document.querySelector(".newsletter-form");
    if (!newsletterForm) return;

    newsletterForm.innerHTML = `
        <input type="email" placeholder="Your email address" required>
        <button type="submit">Subscribe</button>
    `;
}

function showError(message) {
    const newsletterForm = document.querySelector(".newsletter-form");
    if (!newsletterForm) return;

    const errorMsg = document.createElement("p");
    errorMsg.textContent = message;
    errorMsg.style.color = "#dc3545";
    errorMsg.style.marginTop = "10px";
    errorMsg.style.marginBottom = "0";
    newsletterForm.appendChild(errorMsg);

    setTimeout(() => {
        if (errorMsg.parentNode === newsletterForm) {
            newsletterForm.removeChild(errorMsg);
        }
    }, 5000);
}

function renderUniqueUserPost(post) {
    const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://remedy-backend-2lbx.onrender.com';

    const container = document.querySelector(".post-container");
    if (!container) return;

    const postBox = document.createElement("div");
    postBox.className = `post-box ${post.category ? post.category.toLowerCase() : 'all'}`;
    
    const thumbnailUrl = post.media && post.media.length > 0 ? 
        (post.media[0].url.startsWith('http') ? post.media[0].url : BACKEND_URL + "/uploads/" + post.media[0].url) : 
        '/images/default.jpg';
    
    postBox.innerHTML = `
        <img src="${thumbnailUrl}" alt="Post Image" class="post-img" onerror="this.src='/images/default.jpg'" />
        <h2 class="category">${post.category || 'Uncategorized'}</h2>
        <a href="/blog-homepage/readmore/index.html?blogId=${post.id}" class="post-title">${post.title || 'Untitled'}</a>
        <span class="post-date">${new Date(post.created_at).toLocaleDateString()}</span>
        ${post.location ? `<span class="post-location"><i class='bx bx-map'></i> ${post.location}</span>` : ''}
        <p class="post-description">
            ${post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 200) : "No content available."}...
        </p>
        <a href="/blog-homepage/blog-profilepage/index.html?userId=${post.user_id}" class="profile-info" style="display: flex; align-items: center; gap: 10px; margin-top: 15px;">
            <img src="${post.author?.image ? (post.author.image.startsWith('http') ? post.author.image : BACKEND_URL + "/uploads/" + post.author.image) : '/images/default.jpg'}" alt="Author" class="profile-img" style="width: 30px; height: 30px; border-radius: 50%;">
            <span class="profile-name" style="font-size: 0.9rem;">${post.author?.name || "Unknown Author"}</span>
        </a>
    `;

    container.prepend(postBox);
    const allPosts = container.querySelectorAll(".post-box");
    if (allPosts.length > 6) {
        allPosts[allPosts.length - 1].remove();
    }
}