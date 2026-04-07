document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('blogId');

    if (!blogId) {
        alert('No blog ID provided.');
        window.location.href = '/blog-homepage/index.html';
        return;
    }

    // Fetch blog data
    async function loadBlog() {
        try {
            const response = await fetch(`/api/user/blogs/${blogId}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to load blog');
            }
            const blog = await response.json();
            displayBlog(blog);
            loadComments();
            updateLikeStatus();
            updateFollowStatus(blog.user_id);
        } catch (error) {
            console.error('Error loading blog:', error);
            alert('Failed to load blog: ' + error.message);
            window.location.href = '/blog-homepage/index.html';
        }
    }

    // Display blog content
    function displayBlog(blog) {
        try {
            // Set document title
            document.title = blog.title || 'Blog Post';

            // Apply template, font, and layout
            const postContainer = document.getElementById('post-container');
            if (!postContainer) {
                throw new Error('Post container element not found');
            }
            
            // Apply font family to the body
            document.body.style.fontFamily = blog.font_family || 'Roboto';
            
            // Apply layout classes
            postContainer.className = `post-detail ${blog.template || 'modern'} layout-${blog.layout || 'standard'}`;
            postContainer.style.setProperty('--theme-color', blog.theme_color || '#4de4ff');

            // Populate header
            const postTitle = document.getElementById('post-title');
            const postCategory = document.getElementById('post-category');
            const postStatus = document.getElementById('post-status');
            const postDate = document.getElementById('post-date');
            if (!postTitle || !postCategory || !postStatus || !postDate) {
                throw new Error('Post header elements not found');
            }
            postTitle.textContent = blog.title || 'Untitled';
            postCategory.textContent = blog.category || 'Uncategorized';
            postStatus.textContent = blog.status === 'draft' ? 'Draft' : '';
            postDate.textContent = new Date(blog.created_at).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Author info
            const authorLink = document.getElementById('author-profile-link');
            const authorNameLink = document.getElementById('author-name-link');
            const authorName = document.getElementById('post-author-name');
            const authorImage = document.getElementById('post-author-image');
            if (!authorLink || !authorName || !authorImage || !authorNameLink) {
                throw new Error('Author elements not found');
            }
            authorLink.href = `/blog-homepage/blog-profilepage/index.html?userId=${blog.user_id}`;
            authorNameLink.href = `/blog-homepage/blog-profilepage/index.html?userId=${blog.user_id}`;
            authorName.textContent = blog.author.name || 'Unknown';
            authorImage.src = blog.author.image || '/Uploads/default.jpg';
            authorImage.alt = `Profile image of ${blog.author.name || 'Unknown'}`;

            // Tags
            const tagsContainer = document.getElementById('post-tags');
            if (!tagsContainer) {
                throw new Error('Tags container not found');
            }
            tagsContainer.innerHTML = '';
            if (blog.tags && blog.tags.length) {
                blog.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.textContent = `#${tag}`;
                    tagElement.className = 'tag';
                    tagsContainer.appendChild(tagElement);
                });
            }

            // Media
            const mediaContainer = document.getElementById('post-media');
            if (!mediaContainer) {
                throw new Error('Media container not found');
            }
            mediaContainer.innerHTML = '';
            if (blog.media && blog.media.length) {
                blog.media.forEach(media => {
                    if (media.type.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = media.url;
                        img.alt = 'Blog image';
                        img.className = 'media-item';
                        img.setAttribute('role', 'img');
                        mediaContainer.appendChild(img);
                    } else if (media.type.startsWith('video/')) {
                        const video = document.createElement('video');
                        video.src = media.url;
                        video.controls = true;
                        video.className = 'media-item';
                        video.setAttribute('role', 'video');
                        video.setAttribute('aria-label', 'Blog video');
                        mediaContainer.appendChild(video);
                    }
                });
            } else {
                const placeholder = document.createElement('img');
                placeholder.src = '/Uploads/default.jpg';
                placeholder.alt = 'No media available';
                placeholder.className = 'media-item';
                mediaContainer.appendChild(placeholder);
            }

            // Content
            const postContentText = document.getElementById('post-content-text');
            if (!postContentText) {
                throw new Error('Post content text element not found');
            }
            postContentText.innerHTML = blog.content || '<p>No content available.</p>';
        } catch (error) {
            console.error('Error displaying blog:', error);
            alert('Failed to display blog: ' + error.message);
        }
    }

    // Update follow status
    async function updateFollowStatus(userId) {
        try {
            const followContainer = document.getElementById('follow-container');
            if (!followContainer) {
                console.warn('Follow container not found in DOM');
                return;
            }

            // Fetch current user
            const userResponse = await fetch('/api/user', { credentials: 'include' });
            if (!userResponse.ok) {
                followContainer.innerHTML = ''; // Hide buttons if not logged in
                return;
            }
            const currentUser = await userResponse.json();
            if (currentUser.id === userId) {
                followContainer.innerHTML = ''; // Don't show buttons for own profile
                return;
            }

            // Check follow status
            const response = await fetch(`/api/user/follow/status?userId=${userId}`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to check follow status');
            const { isFollowing } = await response.json();

            // Create follow/unfollow button
            const button = document.createElement('button');
            button.className = `follow-btn ${isFollowing ? 'following' : ''}`;
            button.textContent = isFollowing ? 'Following' : 'Follow';
            followContainer.innerHTML = '';
            followContainer.appendChild(button);

            // Handle click
            button.addEventListener('click', async () => {
                try {
                    const endpoint = isFollowing ? `/api/user/unfollow/${userId}` : `/api/user/follow/${userId}`;
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Failed to update follow status');
                    }
                    updateFollowStatus(userId); // Refresh button
                } catch (error) {
                    console.error('Error updating follow status:', error);
                    alert('Failed to update follow status: ' + error.message);
                }
            });
        } catch (error) {
            console.error('Error updating follow status:', error);
            const followContainer = document.getElementById('follow-container');
            if (followContainer) followContainer.innerHTML = '';
        }
    }

    // Load comments
    async function loadComments() {
        try {
            const response = await fetch(`/api/user/blogs/${blogId}/comments`, {
                credentials: 'include'
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to load comments');
            }
            const comments = await response.json();
            displayComments(comments);
        } catch (error) {
            console.error('Error loading comments:', error);
            alert('Failed to load comments: ' + error.message);
        }
    }

    // Display comments
    async function displayComments(comments) {
        const commentsContainer = document.getElementById('comments-container');
        if (!commentsContainer) {
            console.warn('Comments container element not found in DOM');
            return;
        }
        try {
            commentsContainer.innerHTML = '';
            if (comments.length === 0) {
                commentsContainer.innerHTML = '<p>No comments yet.</p>';
                return;
            }

            // Fetch current user to determine delete button visibility
            let currentUser = null;
            try {
                const userResponse = await fetch('/api/user', { credentials: 'include' });
                if (userResponse.ok) {
                    currentUser = await userResponse.json();
                    console.log('Current user:', currentUser.id); // Debug user ID
                } else {
                    console.warn('Failed to fetch current user:', userResponse.status);
                }
            } catch (err) {
                console.error('Error fetching current user:', err);
            }

            // Fetch blog to get owner ID
            let blogOwnerId = null;
            try {
                const blogResponse = await fetch(`/api/user/blogs/${blogId}`, { credentials: 'include' });
                if (blogResponse.ok) {
                    const blog = await blogResponse.json();
                    blogOwnerId = blog.user_id;
                    console.log('Blog owner ID:', blogOwnerId); // Debug owner ID
                } else {
                    console.warn('Failed to fetch blog:', blogResponse.status);
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
            }

            comments.forEach(comment => {
                console.log('Comment author ID:', comment.author.id, 'Checking against current user:', currentUser?.id, 'and blog owner:', blogOwnerId); // Debug visibility
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <a href="/blog-homepage/blog-profilepage/index.html?userId=${comment.author.id}" class="comment-author-link">
                            <img src="${comment.author.image || '/Uploads/default.jpg'}" alt="Profile image of ${comment.author.name || 'User'}" class="comment-author-image">
                        </a>
                        <a href="/blog-homepage/blog-profilepage/index.html?userId=${comment.author.id}" class="comment-author-link">
                            <span class="comment-author">${comment.author.name || 'User'}</span>
                        </a>
                        <span class="comment-date">${new Date(comment.created_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                        <button class="delete-comment-btn" data-comment-id="${comment.id}" style="display: none;">Delete</button>
                    </div>
                    <p class="comment-content">${comment.content}</p>
                `;
                commentsContainer.appendChild(commentElement);

                // Show delete button if user is comment author or blog owner
                const deleteBtn = commentElement.querySelector('.delete-comment-btn');
                if (currentUser && (comment.author.id === currentUser.id || blogOwnerId === currentUser.id)) {
                    console.log('Showing delete button for comment:', comment.id); // Debug button visibility
                    deleteBtn.classList.add('visible');
                    // Debug DOM presence
                    console.log('Delete button for comment', comment.id, 'is in DOM:', deleteBtn.offsetParent !== null);
                    console.log('Delete button classes:', deleteBtn.className);
                    console.log('Delete button style:', deleteBtn.style.cssText);
                }

                // Add event listener for delete button
                deleteBtn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this comment?')) {
                        try {
                            const response = await fetch(`/api/user/blogs/${blogId}/comments/${comment.id}`, {
                                method: 'DELETE',
                                credentials: 'include'
                            });
                            if (!response.ok) {
                                const error = await response.json();
                                throw new Error(error.message || 'Failed to delete comment');
                            }
                            loadComments(); // Refresh comments
                        } catch (error) {
                            console.error('Error deleting comment:', error);
                            alert('Failed to delete comment: ' + error.message);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error displaying comments:', error);
            alert('Failed to display comments: ' + error.message);
        }
    }

    // Update like status
    async function updateLikeStatus() {
        try {
            const likeBtn = document.getElementById('like-btn');
            const likeCountSpan = document.getElementById('like-count');

            if (!likeBtn || !likeCountSpan) {
                console.warn('Like button or count span not found in DOM');
                return;
            }

            // Get like count
            const countResponse = await fetch(`/api/user/blogs/${blogId}/likes`, { credentials: 'include' });
            if (!countResponse.ok) throw new Error('Failed to fetch like count');
            const { count } = await countResponse.json();
            likeCountSpan.textContent = count;

            // Check if user liked
            const checkResponse = await fetch(`/api/user/blogs/${blogId}/likes/check`, { credentials: 'include' });
            if (!checkResponse.ok) throw new Error('Failed to check like status');
            const { liked } = await checkResponse.json();
            likeBtn.classList.toggle('liked', liked);
            likeBtn.textContent = liked ? 'Unlike' : 'Like';
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    }

    // Like button handler
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', async function() {
            try {
                const response = await fetch(`/api/user/like/${blogId}`, {
                    method: 'POST',
                    credentials: 'include'
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to update like');
                }
                updateLikeStatus();
            } catch (error) {
                console.error('Error liking post:', error);
                alert('Failed to like post: ' + error.message);
            }
        });
    } else {
        console.warn('Like button element not found in DOM');
    }

    // Comment form handler
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const commentInput = document.getElementById('comment-input');
            if (!commentInput) {
                console.warn('Comment input element not found in DOM');
                return;
            }
            const content = commentInput.value.trim();
            if (!content) {
                alert('Comment cannot be empty.');
                return;
            }

            try {
                const response = await fetch(`/api/user/blogs/${blogId}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                    credentials: 'include'
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to post comment');
                }
                commentInput.value = '';
                loadComments();
            } catch (error) {
                console.error('Error posting comment:', error);
                alert('Failed to post comment: ' + error.message);
            }
        });
    } else {
        console.warn('Comment form element not found in DOM');
    }

    // Initialize
    loadBlog();
});