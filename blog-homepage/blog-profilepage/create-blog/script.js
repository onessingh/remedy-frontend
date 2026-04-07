document.addEventListener('DOMContentLoaded', function() {
    let selectedTemplate = 'modern';
    let currentSection = 0;
    let blogId = null;
    let isEditMode = false;
    const formSections = document.querySelectorAll('.form-section');
    const templateGrid = document.getElementById('templateGrid');
    let history = [];
    let historyIndex = -1;
    let images = [];
    let videos = [];

    // Template definitions
    const templates = [
        { id: 'minimal', name: 'Minimal', description: 'Clean and simple design', preview: 'minimal-preview' },
        { id: 'modern', name: 'Modern', description: 'Sleek with vibrant colors', preview: 'modern-preview' },
        { id: 'magazine', name: 'Magazine', description: 'Professional and structured', preview: 'magazine-preview' },
        { id: 'creative', name: 'Creative', description: 'Bold and artistic', preview: 'creative-preview' },
        { id: 'vintage', name: 'Vintage', description: 'Classic and nostalgic', preview: 'vintage-preview' },
        { id: 'futuristic', name: 'Futuristic', description: 'Tech-inspired design', preview: 'futuristic-preview' },
        { id: 'cosmic', name: 'Cosmic', description: 'Starry and ethereal', preview: 'cosmic-preview' },
        { id: 'nature', name: 'Nature', description: 'Earthy and serene', preview: 'nature-preview' },
        { id: 'urban', name: 'Urban', description: 'City-inspired and bold', preview: 'urban-preview' },
        { id: 'retro', name: 'Retro', description: '80s-inspired vibes', preview: 'retro-preview' },
        { id: 'elegant', name: 'Elegant', description: 'Sophisticated and refined', preview: 'elegant-preview' },
        { id: 'playful', name: 'Playful', description: 'Fun and colorful', preview: 'playful-preview' },
        { id: 'monochrome', name: 'Monochrome', description: 'Single-tone elegance', preview: 'monochrome-preview' },
        { id: 'industrial', name: 'Industrial', description: 'Raw and rugged', preview: 'industrial-preview' },
        { id: 'bohemian', name: 'Bohemian', description: 'Free-spirited and eclectic', preview: 'bohemian-preview' },
        { id: 'nautical', name: 'Nautical', description: 'Sea-inspired and fresh', preview: 'nautical-preview' },
        { id: 'pastel', name: 'Pastel', description: 'Soft and soothing', preview: 'pastel-preview' },
        { id: 'neon', name: 'Neon', description: 'Bright and electrifying', preview: 'neon-preview' },
        { id: 'rustic', name: 'Rustic', description: 'Warm and countryside', preview: 'rustic-preview' },
        { id: 'artdeco', name: 'Art Deco', description: 'Glamorous and ornate', preview: 'artdeco-preview' }
    ];

    // Template colors
    const templateColors = {
        minimal: { primary: '#6c5ce7', secondary: '#a29bfe', accent: '#fd79a8' },
        modern: { primary: '#0984e3', secondary: '#74b9ff', accent: '#00cec9' },
        magazine: { primary: '#00b894', secondary: '#55efc4', accent: '#fdcb6e' },
        creative: { primary: '#e84393', secondary: '#fd79a8', accent: '#a29bfe' },
        vintage: { primary: '#8b5e3c', secondary: '#d4a276', accent: '#f4e1d2' },
        futuristic: { primary: '#1e3c72', secondary: '#2a5298', accent: '#00ddeb' },
        cosmic: { primary: '#2c3e50', secondary: '#8e44ad', accent: '#e84393' },
        nature: { primary: '#2d6a4f', secondary: '#74c69d', accent: '#f1c453' },
        urban: { primary: '#343a40', secondary: '#6c757d', accent: '#ff6b6b' },
        retro: { primary: '#f4a261', secondary: '#e76f51', accent: '#2a9d8f' },
        elegant: { primary: '#7209b7', secondary: '#f72585', accent: '#b5179e' },
        playful: { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#ffe66d' },
        monochrome: { primary: '#2b2b2b', secondary: '#606060', accent: '#d9d9d9' },
        industrial: { primary: '#3c2f2f', secondary: '#6b7280', accent: '#a4161a' },
        bohemian: { primary: '#9c6644', secondary: '#e7a977', accent: '#7f5539' },
        nautical: { primary: '#1d3557', secondary: '#457b9d', accent: '#e63946' },
        pastel: { primary: '#a8dadc', secondary: '#f1faee', accent: '#ffb3c6' },
        neon: { primary: '#ff006e', secondary: '#8338ec', accent: '#3a86ff' },
        rustic: { primary: '#582f0e', secondary: '#7f4f24', accent: '#936639' },
        artdeco: { primary: '#1b263b', secondary: '#415a77', accent: '#e0c1b3' }
    };

    // Category normalization
    const allowedCategories = ['tech', 'food', 'news', 'travel'];
    const categoryMap = {
        'technology': 'tech',
        'foods': 'food',
        'new': 'news',
        'education': 'news', // Map legacy/incorrect "education" to "news"
        'travels': 'travel'
    };
    const displayCategoryMap = {
        'tech': 'Tech',
        'food': 'Food',
        'news': 'News',
        'travel': 'Travel'
    };

    function normalizeCategory(category) {
        if (!category) return 'tech';
        const lowerCategory = category.toLowerCase();
        return allowedCategories.includes(lowerCategory)
            ? lowerCategory
            : categoryMap[lowerCategory] || 'tech';
    }

    // Check if in edit mode
    function checkEditMode() {
        const urlParams = new URLSearchParams(window.location.search);
        blogId = urlParams.get('blogId');
        isEditMode = !!blogId;
        if (isEditMode) {
            document.getElementById('pageTitle').textContent = 'Edit Your Blog';
            document.getElementById('publishBtn').textContent = 'Update Blog';
            loadBlogData(blogId);
        }
    }

    // Load blog data for editing
    async function loadBlogData(blogId) {
        try {
            const response = await fetch(`/api/user/blogs/${blogId}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                const error = await parseResponseError(response);
                throw new Error(error.message || 'Failed to load blog data');
            }
            const blog = await response.json();

            // Populate form fields
            document.getElementById('blogTitle').value = blog.title || '';
            document.getElementById('blogCategory').value = normalizeCategory(blog.category);
            document.getElementById('blogLocation').value = blog.location || '';
            document.getElementById('blogTags').value = blog.tags ? blog.tags.join(', ') : '';
            document.getElementById('blogContent').innerHTML = blog.content || '';
            document.querySelector(`input[name="layout"][value="${blog.layout || 'standard'}"]`).checked = true;
            document.getElementById('publishOptions').value = blog.status || 'publish';
            if (blog.scheduleDate) {
                document.getElementById('scheduleDate').value = new Date(blog.scheduleDate).toISOString().slice(0, 16);
                document.getElementById('scheduleDateContainer').classList.remove('hidden');
            }
            selectTemplate(blog.template || 'modern');

            // Load existing media
            if (blog.media && blog.media.length) {
                const imagePreview = document.querySelector('.image-preview');
                const videoPreview = document.querySelector('.video-preview');
                imagePreview.innerHTML = '';
                videoPreview.innerHTML = '';
                blog.media.forEach((media, index) => {
                    if (media.type.startsWith('image')) {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'image-preview-item';
                        const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                            ? 'http://localhost:5000' 
                            : 'https://remedy-backend-2lbx.onrender.com';

                        const img = document.createElement('img');
                        img.src = media.url.startsWith('http') ? media.url : BACKEND_URL + "/uploads/" + media.url;
                        img.setAttribute('role', 'img');
                        img.setAttribute('aria-label', 'Uploaded image preview');
                        const removeBtn = document.createElement('button');
                        removeBtn.textContent = 'Remove';
                        removeBtn.className = 'remove-image-btn';
                        removeBtn.addEventListener('click', () => removeImage(index));
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(removeBtn);
                        imagePreview.appendChild(imgContainer);
                        images.push({
                            url: media.url,
                            type: media.type,
                            isThumbnail: media.isThumbnail
                        });
                    } else if (media.type.startsWith('video')) {
                        const videoContainer = document.createElement('div');
                        videoContainer.className = 'video-preview-item';
                        const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                            ? 'http://localhost:5000' 
                            : 'https://remedy-backend-2lbx.onrender.com';

                        const video = document.createElement('video');
                        video.src = media.url.startsWith('http') ? media.url : BACKEND_URL + "/uploads/" + media.url;
                        video.controls = true;
                        video.setAttribute('role', 'video');
                        video.setAttribute('aria-label', 'Uploaded video preview');
                        const removeBtn = document.createElement('button');
                        removeBtn.textContent = 'Remove';
                        removeBtn.className = 'remove-video-btn';
                        removeBtn.addEventListener('click', () => removeVideo(index));
                        videoContainer.appendChild(video);
                        videoContainer.appendChild(removeBtn);
                        videoPreview.appendChild(videoContainer);
                        videos.push({
                            url: media.url,
                            type: media.type,
                            isThumbnail: media.isThumbnail
                        });
                    }
                });
                imagePreview.style.display = images.length ? 'flex' : 'none';
                videoPreview.style.display = videos.length ? 'flex' : 'none';
            }

            // Trigger tag preview update
            document.getElementById('blogTags').dispatchEvent(new Event('input'));

            updatePreview();
            saveState();
        } catch (error) {
            console.error('Error loading blog data:', error);
            alert('Failed to load blog data: ' + error.message);
        }
    }

    // Helper to parse response errors
    async function parseResponseError(response) {
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            const text = await response.text();
            return { message: `Server returned non-JSON response: ${text.slice(0, 100)}...` };
        } catch (e) {
            return { message: `Failed to parse error response: ${e.message}` };
        }
    }

    // Generate template cards
    function generateTemplateCards() {
        try {
            if (!templateGrid) throw new Error('Template grid element not found');
            templateGrid.innerHTML = '';
            templates.forEach(template => {
                const card = document.createElement('div');
                card.className = `template-card ${template.id === selectedTemplate ? 'selected' : ''}`;
                card.dataset.template = template.id;
                card.innerHTML = `
                    <div class="template-preview ${template.preview}" role="img" aria-label="${template.name} template preview"></div>
                    <h3>${template.name}</h3>
                    <p>${template.description}</p>
                `;
                card.addEventListener('click', () => selectTemplate(template.id));
                templateGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error generating template cards:', error);
            alert('Failed to load templates. Please refresh the page.');
        }
    }

    // Select template
    function selectTemplate(templateId) {
        try {
            document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
            const selectedCard = document.querySelector(`.template-card[data-template="${templateId}"]`);
            if (!selectedCard) throw new Error('Selected template card not found');
            selectedCard.classList.add('selected');
            selectedTemplate = templateId;
            applyTemplateStyles(templateId);
            saveState();
        } catch (error) {
            console.error('Error selecting template:', error);
            alert('Failed to select template: ' + error.message);
        }
    }

    // Apply template styles
    function applyTemplateStyles(templateId) {
        try {
            const colors = templateColors[templateId] || templateColors.minimal;
            const editorContainer = document.querySelector('.editor-container');
            if (!editorContainer) throw new Error('Editor container not found');
            editorContainer.style.setProperty('--primary-color', colors.primary);
            editorContainer.style.setProperty('--secondary-color', colors.secondary);
            editorContainer.style.setProperty('--accent-color', colors.accent);
        } catch (error) {
            console.error('Error applying template styles:', error);
            alert('Failed to apply template styles: ' + error.message);
        }
    }

    // Template slider
    window.slideTemplates = function(direction) {
        try {
            const grid = templateGrid;
            if (!grid) throw new Error('Template grid not found');
            const cardWidth = 250 + 24;
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } catch (error) {
            console.error('Error sliding templates:', error);
            alert('Failed to slide templates: ' + error.message);
        }
    };

    // Form navigation
    formSections[0]?.classList.add('active');
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            try {
                if (validateCurrentSection()) {
                    formSections[currentSection].classList.remove('active');
                    currentSection++;
                    formSections[currentSection].classList.add('active');
                    updatePreview();
                    saveState();
                }
            } catch (error) {
                console.error('Error navigating to next section:', error);
                alert('Failed to navigate to next section: ' + error.message);
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            try {
                formSections[currentSection].classList.remove('active');
                currentSection--;
                formSections[currentSection].classList.add('active');
                updatePreview();
                saveState();
            } catch (error) {
                console.error('Error navigating to previous section:', error);
                alert('Failed to navigate to previous section: ' + error.message);
            }
        });
    });

    // Save draft
    async function saveDraft() {
        try {
            const title = document.getElementById('blogTitle')?.value || '';
            const content = document.getElementById('blogContent')?.innerHTML || '';
            const category = normalizeCategory(document.getElementById('blogCategory')?.value);
            const location = document.getElementById('blogLocation')?.value.trim() || null;
            const tags = document.getElementById('blogTags')?.value.split(',').map(tag => tag.trim()).filter(tag => tag) || [];
            const layout = document.querySelector('input[name="layout"]:checked')?.value || 'standard';
            const fontFamily = document.querySelector('select[onchange*="fontName"]')?.value || 'Poppins';
            const themeColor = templateColors[selectedTemplate]?.primary || '#6c5ce7';

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('category', category);
            formData.append('location', location);
            formData.append('tags', JSON.stringify(tags));
            formData.append('layout', layout);
            formData.append('status', 'draft');
            formData.append('font_family', fontFamily);
            formData.append('theme_color', themeColor);
            formData.append('template', selectedTemplate);

            let mediaIndex = 0;
            images.forEach((img, index) => {
                if (img.blob) {
                    formData.append('media', img.blob, img.name);
                    formData.append(`media_${mediaIndex}_type`, img.type);
                    formData.append(`media_${mediaIndex}_isThumbnail`, img.isThumbnail ? 'true' : 'false');
                    mediaIndex++;
                }
            });

            videos.forEach((video, index) => {
                if (video.blob) {
                    formData.append('media', video.blob, video.name);
                    formData.append(`media_${mediaIndex}_type`, video.type);
                    formData.append(`media_${mediaIndex}_isThumbnail`, video.isThumbnail ? 'true' : 'false');
                    mediaIndex++;
                }
            });

            const url = isEditMode ? `/api/user/blogs/${blogId}` : '/api/user/blogs';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await parseResponseError(response);
                throw new Error(error.message || 'Failed to save draft');
            }

            const result = await response.json();
            if (!isEditMode) blogId = result.blogId;
            alert('Draft saved successfully!');
            loadDrafts();
        } catch (error) {
            console.error('Error saving draft:', error);
            alert('Failed to save draft: ' + error.message);
        }
    }

    // Load drafts
    async function loadDrafts() {
        try {
            const response = await fetch('/api/user/drafts', {
                credentials: 'include'
            });
            if (!response.ok) {
                const error = await parseResponseError(response);
                throw new Error(error.message || 'Failed to load drafts');
            }
            const drafts = await response.json();
            const draftsContainer = document.getElementById('uploadedBlogs');
            if (!draftsContainer) throw new Error('Drafts container not found');
            draftsContainer.innerHTML = '';
            drafts.forEach(draft => {
                const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? 'http://localhost:5000' 
                    : 'https://remedy-backend-2lbx.onrender.com';

                const draftElement = document.createElement('div');
                draftElement.className = 'uploaded-blog';
                const thumbnailUrl = draft.thumbnail_url 
                    ? (draft.thumbnail_url.startsWith('http') ? draft.thumbnail_url : BACKEND_URL + "/uploads/" + draft.thumbnail_url)
                    : '/images/default.jpg';

                draftElement.innerHTML = `
                    <div class="uploaded-blog-image" style="background-image: url(${thumbnailUrl})"></div>
                    <div class="uploaded-blog-content">
                        <h3>${draft.title}</h3>
                        <p>${draft.content.substring(0, 100)}...</p>
                        <div class="uploaded-blog-meta">
                            <span>${new Date(draft.created_at).toLocaleDateString()}</span>
                            <span>${displayCategoryMap[draft.category] || draft.category}</span>
                        </div>
                        <div class="draft-actions">
                            <button class="publish-btn" onclick="publishDraft(${draft.id})">Publish</button>
                            <button class="delete-btn" onclick="deleteDraft(${draft.id})">Delete</button>
                        </div>
                    </div>
                `;
                draftsContainer.appendChild(draftElement);
            });
        } catch (error) {
            console.error('Error loading drafts:', error);
            alert('Failed to load drafts: ' + error.message);
        }
    }

    // Publish draft
    window.publishDraft = async function(draftId) {
        try {
            const response = await fetch(`/api/user/blogs/${draftId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'publish' }),
                credentials: 'include'
            });
            if (!response.ok) {
                const error = await parseResponseError(response);
                throw new Error(error.message || 'Failed to publish draft');
            }
            alert('Draft published successfully!');
            loadDrafts();
        } catch (error) {
            console.error('Error publishing draft:', error);
            alert('Failed to publish draft: ' + error.message);
        }
    };

    // Delete draft
    window.deleteDraft = async function(draftId) {
        if (confirm('Are you sure you want to delete this draft?')) {
            try {
                const response = await fetch(`/api/user/blogs/${draftId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!response.ok) {
                    const error = await parseResponseError(response);
                    throw new Error(error.message || 'Failed to delete draft');
                }
                alert('Draft deleted successfully!');
                loadDrafts();
            } catch (error) {
                console.error('Error deleting draft:', error);
                alert('Failed to delete draft: ' + error.message);
            }
        }
    };

    // Tag input
    const tagsInput = document.getElementById('blogTags');
    const tagPreview = document.getElementById('tagPreview');
    if (tagsInput && tagPreview) {
        tagsInput.addEventListener('input', function() {
            try {
                const tags = this.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '' && /^[a-zA-Z0-9-]+$/.test(tag));
                tagPreview.innerHTML = '';
                tags.forEach(tag => {
                    if (tag) {
                        const tagElement = document.createElement('span');
                        tagElement.textContent = tag;
                        tagElement.setAttribute('role', 'listitem');
                        tagPreview.appendChild(tagElement);
                    }
                });
                saveState();
            } catch (error) {
                console.error('Error updating tags:', error);
                alert('Invalid tag format. Use letters, numbers, and hyphens only.');
            }
        });
    }

    // Image and video upload
    const imageInput = document.getElementById('blogImages');
    const videoInput = document.getElementById('blogVideos');
    const imagePreview = document.querySelector('.image-preview');
    const videoPreview = document.querySelector('.video-preview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            try {
                const files = Array.from(this.files);
                if (files.some(file => file.size > 5 * 1024 * 1024)) {
                    alert('Each image must be less than 5MB.');
                    this.value = '';
                    return;
                }
                files.forEach((file, index) => {
                    if (!file.type.startsWith('image/')) {
                        alert('Please upload valid image files.');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'image-preview-item';
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.setAttribute('role', 'img');
                        img.setAttribute('aria-label', 'Uploaded image preview');
                        const removeBtn = document.createElement('button');
                        removeBtn.textContent = 'Remove';
                        removeBtn.className = 'remove-image-btn';
                        removeBtn.addEventListener('click', () => removeImage(images.length - 1));
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(removeBtn);
                        imagePreview.appendChild(imgContainer);
                        const isThumbnail = images.length === 0 && videos.length === 0;
                        images.push({ blob: file, type: file.type, name: file.name, isThumbnail });
                        imagePreview.style.display = 'flex';
                        saveState();
                    };
                    reader.readAsDataURL(file);
                });
                this.value = ''; // Clear input to allow re-uploading
            } catch (error) {
                console.error('Error uploading images:', error);
                alert('Failed to upload images: ' + error.message);
            }
        });
    }

    function removeImage(index) {
        try {
            if (index >= 0 && index < images.length) {
                images.splice(index, 1);
                updateImagePreview();
                // Update thumbnail status
                if (images.length > 0) {
                    images[0].isThumbnail = videos.length === 0;
                } else if (videos.length > 0) {
                    videos[0].isThumbnail = true;
                }
                saveState();
            }
        } catch (error) {
            console.error('Error removing image:', error);
            alert('Failed to remove image: ' + error.message);
        }
    }

    function updateImagePreview() {
        try {
            if (!imagePreview) throw new Error('Image preview element not found');
            imagePreview.innerHTML = '';
            images.forEach((img, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-preview-item';
                const image = document.createElement('img');
                image.src = img.url || URL.createObjectURL(img.blob);
                image.setAttribute('role', 'img');
                image.setAttribute('aria-label', 'Uploaded image preview');
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.className = 'remove-image-btn';
                removeBtn.addEventListener('click', () => removeImage(index));
                imgContainer.appendChild(image);
                imgContainer.appendChild(removeBtn);
                imagePreview.appendChild(imgContainer);
            });
            imagePreview.style.display = images.length ? 'flex' : 'none';
        } catch (error) {
            console.error('Error updating image preview:', error);
            alert('Failed to update image preview: ' + error.message);
        }
    }

    if (videoInput && videoPreview) {
        videoInput.addEventListener('change', function() {
            try {
                const files = Array.from(this.files);
                if (files.some(file => file.size > 10 * 1024 * 1024)) {
                    alert('Each video must be less than 10MB.');
                    this.value = '';
                    return;
                }
                files.forEach((file, index) => {
                    if (!file.type.startsWith('video/')) {
                        alert('Please upload valid video files.');
                        return;
                    }
                    const videoContainer = document.createElement('div');
                    videoContainer.className = 'video-preview-item';
                    const video = document.createElement('video');
                    const url = URL.createObjectURL(file);
                    video.src = url;
                    video.controls = true;
                    video.setAttribute('role', 'video');
                    video.setAttribute('aria-label', 'Uploaded video preview');
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-video-btn';
                    removeBtn.addEventListener('click', () => removeVideo(videos.length - 1));
                    videoContainer.appendChild(video);
                    videoContainer.appendChild(removeBtn);
                    videoPreview.appendChild(videoContainer);
                    video.onloadeddata = () => URL.revokeObjectURL(url);
                    const isThumbnail = images.length === 0 && videos.length === 0;
                    videos.push({ blob: file, type: file.type, name: file.name, isThumbnail });
                    videoPreview.style.display = 'flex';
                    saveState();
                });
                this.value = ''; // Clear input to allow re-uploading
            } catch (error) {
                console.error('Error uploading videos:', error);
                alert('Failed to upload videos: ' + error.message);
            }
        });
    }

    function removeVideo(index) {
        try {
            if (index >= 0 && index < videos.length) {
                videos.splice(index, 1);
                updateVideoPreview();
                // Update thumbnail status
                if (videos.length > 0) {
                    videos[0].isThumbnail = images.length === 0;
                } else if (images.length > 0) {
                    images[0].isThumbnail = true;
                }
                saveState();
            }
        } catch (error) {
            console.error('Error removing video:', error);
            alert('Failed to remove video: ' + error.message);
        }
    }

    function updateVideoPreview() {
        try {
            if (!videoPreview) throw new Error('Video preview element not found');
            videoPreview.innerHTML = '';
            videos.forEach((video, index) => {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'video-preview-item';
                const vid = document.createElement('video');
                vid.src = video.url || URL.createObjectURL(video.blob);
                vid.controls = true;
                vid.setAttribute('role', 'video');
                vid.setAttribute('aria-label', 'Uploaded video preview');
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.className = 'remove-video-btn';
                removeBtn.addEventListener('click', () => removeVideo(index));
                videoContainer.appendChild(vid);
                videoContainer.appendChild(removeBtn);
                videoPreview.appendChild(videoContainer);
            });
            videoPreview.style.display = videos.length ? 'flex' : 'none';
        } catch (error) {
            console.error('Error updating video preview:', error);
            alert('Failed to update video preview: ' + error.message);
        }
    }

    // Publish options
    const publishOptions = document.getElementById('publishOptions');
    const scheduleDateContainer = document.getElementById('scheduleDateContainer');
    if (publishOptions && scheduleDateContainer) {
        publishOptions.addEventListener('change', function() {
            try {
                scheduleDateContainer.classList.toggle('hidden', this.value !== 'schedule');
                saveState();
            } catch (error) {
                console.error('Error toggling schedule date:', error);
                alert('Failed to toggle schedule date: ' + error.message);
            }
        });
    }

    // Publish button
    const publishBtn = document.getElementById('publishBtn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            try {
                if (validateCurrentSection()) {
                    uploadBlog();
                }
            } catch (error) {
                console.error('Error publishing blog:', error);
                alert('Failed to publish blog: ' + error.message);
            }
        });
    }

    // Save draft button
    document.querySelector('.save-draft-btn')?.addEventListener('click', saveDraft);

    // Editor functionality
    const contentEditor = document.getElementById('blogContent');
    if (contentEditor) {
        ['input', 'keyup', 'paste'].forEach(event => {
            contentEditor.addEventListener(event, () => {
                try {
                    saveState();
                    updatePreview();
                } catch (error) {
                    console.error('Error updating editor:', error);
                    alert('Failed to update editor: ' + error.message);
                }
            });
        });
    }

    // History for undo/redo
    function saveState() {
        try {
            const state = {
                template: selectedTemplate,
                section: currentSection,
                title: document.getElementById('blogTitle')?.value || '',
                category: normalizeCategory(document.getElementById('blogCategory')?.value),
                location: document.getElementById('blogLocation')?.value || '',
                tags: document.getElementById('blogTags')?.value || '',
                content: contentEditor?.innerHTML || '',
                images: images.map(img => ({
                    name: img.name,
                    type: img.type,
                    size: img.blob ? img.blob.size : 0,
                    isThumbnail: img.isThumbnail,
                    url: img.url || null
                })),
                videos: videos.map(video => ({
                    name: video.name,
                    type: video.type,
                    size: video.blob ? video.blob.size : 0,
                    isThumbnail: video.isThumbnail,
                    url: video.url || null
                })),
                layout: document.querySelector('input[name="layout"]:checked')?.value || 'standard',
                publishOption: document.getElementById('publishOptions')?.value || 'publish',
                scheduleDate: document.getElementById('scheduleDate')?.value || ''
            };
            history = history.slice(0, historyIndex + 1);
            history.push(state);
            historyIndex++;
        } catch (error) {
            console.error('Error saving state:', error);
            alert('Failed to save state: ' + error.message);
        }
    }

    window.undo = function() {
        try {
            if (historyIndex > 0) {
                historyIndex--;
                restoreState(history[historyIndex]);
            }
        } catch (error) {
            console.error('Error undoing:', error);
            alert('Failed to undo: ' + error.message);
        }
    };

    window.redo = function() {
        try {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                restoreState(history[historyIndex]);
            }
        } catch (error) {
            console.error('Error redoing:', error);
            alert('Failed to redo: ' + error.message);
        }
    };

    function restoreState(state) {
        try {
            selectedTemplate = state.template;
            currentSection = state.section;
            document.getElementById('blogTitle').value = state.title;
            document.getElementById('blogCategory').value = state.category;
            document.getElementById('blogLocation').value = state.location || '';
            document.getElementById('blogTags').value = state.tags;
            contentEditor.innerHTML = state.content;
            document.querySelector(`input[name="layout"][value="${state.layout}"]`).checked = true;
            document.getElementById('publishOptions').value = state.publishOption;
            document.getElementById('scheduleDate').value = state.scheduleDate;

            // Restore images and videos
            if (imagePreview && videoPreview) {
                imagePreview.innerHTML = '';
                videoPreview.innerHTML = '';
                images = [];
                videos = [];
                state.images.forEach(img => {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'image-preview-item';
                    const image = document.createElement('img');
                    image.src = img.url || (img.blob ? URL.createObjectURL(img.blob) : '');
                    image.setAttribute('role', 'img');
                    image.setAttribute('aria-label', 'Uploaded image preview');
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-image-btn';
                    removeBtn.addEventListener('click', () => removeImage(images.length - 1));
                    imgContainer.appendChild(image);
                    imgContainer.appendChild(removeBtn);
                    imagePreview.appendChild(imgContainer);
                    images.push({ ...img, blob: img.blob || null, isThumbnail: img.isThumbnail });
                });
                state.videos.forEach(video => {
                    const videoContainer = document.createElement('div');
                    videoContainer.className = 'video-preview-item';
                    const vid = document.createElement('video');
                    vid.src = video.url || (video.blob ? URL.createObjectURL(video.blob) : '');
                    vid.controls = true;
                    vid.setAttribute('role', 'video');
                    vid.setAttribute('aria-label', 'Uploaded video preview');
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-video-btn';
                    removeBtn.addEventListener('click', () => removeVideo(videos.length - 1));
                    videoContainer.appendChild(vid);
                    videoContainer.appendChild(removeBtn);
                    videoPreview.appendChild(videoContainer);
                    videos.push({ ...video, blob: video.blob || null, isThumbnail: video.isThumbnail });
                });
                imagePreview.style.display = state.images.length ? 'flex' : 'none';
                videoPreview.style.display = state.videos.length ? 'flex' : 'none';
            }

            // Update UI
            formSections.forEach((section, index) => {
                section.classList.toggle('active', index === currentSection);
            });
            generateTemplateCards();
            applyTemplateStyles(selectedTemplate);
            tagsInput?.dispatchEvent(new Event('input'));
            updatePreview();
        } catch (error) {
            console.error('Error restoring state:', error);
            alert('Failed to restore state: ' + error.message);
        }
    }

    // Tab switching
    window.openTab = function(evt, tabName) {
        try {
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });

            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });

            const selectedContent = document.getElementById(tabName);
            if (!selectedContent) throw new Error('Tab content not found');
            selectedContent.classList.add('active');
            selectedContent.style.display = 'block';

            evt.currentTarget.classList.add('active');
            evt.currentTarget.setAttribute('aria-selected', 'true');
            saveState();
        } catch (error) {
            console.error('Error opening tab:', error);
            alert('Failed to open tab: ' + error.message);
        }
    };

    // Formatting functions
    window.format = function(command, value = null) {
        try {
            if (command === 'fontSize' && !Number.isInteger(parseFloat(value))) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const span = document.createElement('span');
                    const ptSize = {
                        '2.5': '8pt',
                        '3': '10pt',
                        '3.5': '11pt',
                        '4': '12pt',
                        '4.5': '13pt',
                        '5': '14pt',
                        '5.5': '16pt',
                        '6': '18pt',
                        '6.5': '20pt',
                        '7': '24pt',
                        '8': '36pt'
                    }[value];
                    if (ptSize) {
                        span.style.fontSize = ptSize;
                        range.surroundContents(span);
                    }
                }
            } else {
                document.execCommand(command, false, value);
            }
            saveState();
            contentEditor?.focus();
        } catch (error) {
            console.error('Error formatting:', error);
            alert('Failed to apply formatting: ' + error.message);
        }
    };

    window.changeColor = function() {
        try {
            const color = document.getElementById('textColor')?.value;
            if (!color) throw new Error('Text color input not found');
            document.execCommand('foreColor', false, color);
            saveState();
            contentEditor?.focus();
        } catch (error) {
            console.error('Error changing color:', error);
            alert('Failed to apply color: ' + error.message);
        }
    };

    window.createHyperlink = function() {
        try {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
                alert('Please select text to create a hyperlink.');
                return;
            }
            const url = prompt('Enter the URL (e.g., https://example.com):');
            if (url && /^https?:\/\/[^\s]+$/.test(url)) {
                document.execCommand('createLink', false, url);
                saveState();
            } else if (url) {
                alert('Please enter a valid URL starting with http:// or https://');
            }
            contentEditor?.focus();
        } catch (error) {
            console.error('Error creating hyperlink:', error);
            alert('Failed to create hyperlink: ' + error.message);
        }
    };

    function validateCurrentSection() {
        try {
            const currentForm = formSections[currentSection];
            if (!currentForm) throw new Error('Current form section not found');
            const requiredInputs = currentForm.querySelectorAll('[required]');
            let isValid = true;

            requiredInputs.forEach(input => {
                if (!input.value) {
                    input.style.borderColor = 'var(--danger-color)';
                    input.setCustomValidity('This field is required.');
                    input.reportValidity();
                    isValid = false;
                    setTimeout(() => {
                        input.style.borderColor = '#ddd';
                        input.setCustomValidity('');
                    }, 2000);
                }
            });

            if (currentSection === 1) {
                const content = contentEditor?.textContent.trim();
                if (!content) {
                    contentEditor.style.borderColor = 'var(--danger-color)';
                    contentEditor.setAttribute('aria-invalid', 'true');
                    setTimeout(() => {
                        contentEditor.style.borderColor = '#ddd';
                        contentEditor.removeAttribute('aria-invalid');
                    }, 2000);
                    isValid = false;
                }
            }

            return isValid;
        } catch (error) {
            console.error('Error validating section:', error);
            alert('Failed to validate section: ' + error.message);
            return false;
        }
    }

    function updatePreview() {
        try {
            if (currentSection === 3) {
                const title = document.getElementById('blogTitle')?.value || '';
                const content = document.getElementById('blogContent')?.innerHTML || '';
                const category = normalizeCategory(document.getElementById('blogCategory')?.value);
                const tags = document.getElementById('blogTags')?.value || '';
                const layout = document.querySelector('input[name="layout"]:checked')?.value || 'standard';
                const previewDiv = document.getElementById('blogPreview');
                if (!previewDiv) throw new Error('Blog preview element not found');
                previewDiv.innerHTML = '';

                const blogContainer = document.createElement('div');
                blogContainer.className = `preview-blog ${selectedTemplate} layout-${layout}`;

                const titleElement = document.createElement('h3');
                titleElement.textContent = title;

                const metaElement = document.createElement('div');
                metaElement.className = 'preview-meta';
                metaElement.innerHTML = `
                    <span class="category">${displayCategoryMap[category] || category}</span>
                    <span class="tags">${tags.split(',').map(t => `#${t.trim()}`).join(' ')}</span>
                `;

                const mediaElement = document.createElement('div');
                mediaElement.className = 'preview-media';

                images.forEach(img => {
                    const image = document.createElement('img');
                    image.src = img.url || URL.createObjectURL(img.blob);
                    image.setAttribute('role', 'img');
                    image.setAttribute('aria-label', 'Blog preview image');
                    mediaElement.appendChild(image);
                    if (!img.url) image.onload = () => URL.revokeObjectURL(image.src);
                });

                videos.forEach(video => {
                    const vid = document.createElement('video');
                    vid.src = video.url || URL.createObjectURL(video.blob);
                    vid.controls = true;
                    vid.setAttribute('role', 'video');
                    vid.setAttribute('aria-label', 'Blog preview video');
                    mediaElement.appendChild(vid);
                    if (!video.url) vid.onloadeddata = () => URL.revokeObjectURL(vid.src);
                });

                const contentElement = document.createElement('div');
                contentElement.className = 'preview-content';
                contentElement.innerHTML = content;

                blogContainer.appendChild(titleElement);
                blogContainer.appendChild(metaElement);
                blogContainer.appendChild(mediaElement);
                blogContainer.appendChild(contentElement);

                previewDiv.appendChild(blogContainer);
            }
        } catch (error) {
            console.error('Error updating preview:', error);
            alert('Failed to update preview: ' + error.message);
        }
    }

    async function uploadBlog() {
        try {
            const title = document.getElementById('blogTitle')?.value || '';
            const content = document.getElementById('blogContent')?.innerHTML || '';
            const category = normalizeCategory(document.getElementById('blogCategory')?.value);
            const location = document.getElementById('blogLocation')?.value.trim() || null;
            const tags = document.getElementById('blogTags')?.value.split(',').map(tag => tag.trim()).filter(tag => tag) || [];
            const layout = document.querySelector('input[name="layout"]:checked')?.value || 'standard';
            const publishOption = document.getElementById('publishOptions')?.value || 'publish';
            const scheduleDate = publishOption === 'schedule' ? document.getElementById('scheduleDate')?.value : null;
            const fontFamily = document.querySelector('select[onchange*="fontName"]')?.value || 'Poppins';
            const themeColor = templateColors[selectedTemplate]?.primary || '#6c5ce7';

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('category', category);
            formData.append('location', location);
            formData.append('tags', JSON.stringify(tags));
            formData.append('layout', layout);
            formData.append('status', publishOption);
            formData.append('font_family', fontFamily);
            formData.append('theme_color', themeColor);
            formData.append('template', selectedTemplate);
            if (scheduleDate) formData.append('scheduleDate', scheduleDate);

            let mediaIndex = 0;
            images.forEach((img, index) => {
                if (img.blob) {
                    formData.append('media', img.blob, img.name);
                    formData.append(`media_${mediaIndex}_type`, img.type);
                    formData.append(`media_${mediaIndex}_isThumbnail`, img.isThumbnail ? 'true' : 'false');
                    mediaIndex++;
                }
            });

            videos.forEach((video, index) => {
                if (video.blob) {
                    formData.append('media', video.blob, video.name);
                    formData.append(`media_${mediaIndex}_type`, video.type);
                    formData.append(`media_${mediaIndex}_isThumbnail`, video.isThumbnail ? 'true' : 'false');
                    mediaIndex++;
                }
            });

            const url = isEditMode ? `/api/user/blogs/${blogId}` : '/api/user/blogs';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await parseResponseError(response);
                throw new Error(error.message || 'Failed to save blog');
            }

            const result = await response.json();
            alert(isEditMode ? 'Blog updated successfully!' : 'Blog published successfully!');
            window.location.href = '/blog-homepage/index.html';
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Failed to save blog: ' + error.message);
        }
    }

    // Initialize
    try {
        generateTemplateCards();
        applyTemplateStyles(selectedTemplate);
        checkEditMode();
        saveState();
        loadDrafts();
    } catch (error) {
        console.error('Error initializing:', error);
        alert('Failed to initialize: ' + error.message);
    }
});