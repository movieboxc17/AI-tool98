document.addEventListener('DOMContentLoaded', function() {
    // User state
    let userCredits = 100;
    let generatedImages = [];
    
    // DOM elements
    const creditCountElement = document.getElementById('credit-count');
    const generateBtn = document.getElementById('generate-btn');
    const promptInput = document.getElementById('prompt');
    const styleSelect = document.getElementById('style');
    const sizeSelect = document.getElementById('size');
    const imageResults = document.getElementById('image-results');
    const loadingElement = document.getElementById('loading');
    const buyCreditsBtn = document.getElementById('buy-credits');
    const creditsModal = document.getElementById('credits-modal');
    const paymentModal = document.getElementById('payment-modal');
    const paymentOkBtn = document.getElementById('payment-ok');
    
    // Update credit display
    function updateCreditDisplay() {
        creditCountElement.textContent = userCredits;
    }
    
    // Generate a random image URL (mock API response)
    function generateMockImageUrl(prompt, style) {
        // In a real app, this would be an API call to an image generation service
        const imageCategories = [
            'nature', 'abstract', 'animals', 'city', 'space', 
            'fantasy', 'art', 'technology', 'food', 'people'
        ];
        
        // Use the prompt to somewhat determine the category
        let category = imageCategories[Math.floor(Math.random() * imageCategories.length)];
        if (prompt.toLowerCase().includes('cat')) category = 'animals';
        if (prompt.toLowerCase().includes('space')) category = 'space';
        if (prompt.toLowerCase().includes('city')) category = 'city';
        
        // Generate a random image ID
        const imageId = Math.floor(Math.random() * 1000);
        
        // Return a placeholder image URL
        return `https://source.unsplash.com/random/800x600/?${category}`;
    }
    
    // Generate image function
    function generateImage() {
        const prompt = promptInput.value.trim();
        const style = styleSelect.value;
        const size = sizeSelect.value;
        
        if (!prompt) {
            alert('Please enter a description for your image.');
            return;
        }
        
        if (userCredits < 2) {
            alert('Not enough credits. Please purchase more credits to continue.');
            openCreditsModal();
            return;
        }
        
        // Deduct credits
        userCredits -= 2;
        updateCreditDisplay();
        
        // Show loading state
        loadingElement.classList.remove('hidden');
        
        // Simulate API call delay
        setTimeout(() => {
            // Generate mock image URL
            const imageUrl = generateMockImageUrl(prompt, style);
            
            // Create new image object
            const newImage = {
                id: Date.now(),
                url: imageUrl,
                prompt: prompt,
                style: style,
                size: size,
                date: new Date().toLocaleDateString()
            };
            
            // Add to generated images array
            generatedImages.unshift(newImage);
            
            // Update UI
            displayImages();
            
            // Hide loading state
            loadingElement.classList.add('hidden');
        }, 2000); // 2 second delay to simulate API call
    }
    
    // Display generated images
    function displayImages() {
        imageResults.innerHTML = '';
        
        if (generatedImages.length === 0) {
            imageResults.innerHTML = '<p class="no-images">No images generated yet. Create your first masterpiece!</p>';
            return;
        }
        
        generatedImages.forEach(image => {
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            
            imageCard.innerHTML = `
                <img src="${image.url}" alt="${image.prompt}" loading="lazy">
                <div class="image-info">
                    <div class="image-prompt">${image.prompt}</div>
                    <div class="image-meta">
                        <span>${image.style}</span>
                        <span>${image.date}</span>
                    </div>
                </div>
            `;
            
            imageResults.appendChild(imageCard);
        });
    }
    
    // Open credits modal
    function openCreditsModal() {
        creditsModal.style.display = 'block';
    }
    
    // Close modals
    function closeModals() {
        creditsModal.style.display = 'none';
        paymentModal.style.display = 'none';
    }
    
    // Process credit purchase
    function purchaseCredits(amount) {
        // In a real app, this would integrate with a payment processor
        // For this demo, we'll just add the credits immediately
        
        // Close credits modal
        creditsModal.style.display = 'none';
        
        // Show payment confirmation
        paymentModal.style.display = 'block';
        
        // Add credits to user account
        userCredits += amount;
        updateCreditDisplay();
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generateImage);
    
    buyCreditsBtn.addEventListener('click', openCreditsModal);
    
    // Close modal when clicking the × button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === creditsModal) {
            creditsModal.style.display = 'none';
        }
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });
    
    // Handle credit package purchase buttons
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseInt(this.getAttribute('data-amount'));
            purchaseCredits(amount);
        });
    });
    
    // Handle payment confirmation
    paymentOkBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
    
    // Initialize the app
    updateCreditDisplay();
    displayImages();
    
    // Add keyboard shortcut for generating images (Ctrl+Enter)
    promptInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            generateImage();
        }
    });
    
    // Add local storage to persist user data (in a real app, this would be server-side)
    function saveUserData() {
        const userData = {
            credits: userCredits,
            images: generatedImages
        };
        localStorage.setItem('aiImageGeneratorUserData', JSON.stringify(userData));
    }
    
    function loadUserData() {
        const savedData = localStorage.getItem('aiImageGeneratorUserData');
        if (savedData) {
            const userData = JSON.parse(savedData);
            userCredits = userData.credits;
            generatedImages = userData.images;
            updateCreditDisplay();
            displayImages();
        }
    }
    
    // Save data when user leaves the page
    window.addEventListener('beforeunload', saveUserData);
    
    // Load user data on startup
    loadUserData();
    
    // Add a free daily credit feature (in a real app, this would be server-side)
    const lastCreditDate = localStorage.getItem('lastFreeCreditsDate');
    const today = new Date().toDateString();
    
    if (lastCreditDate !== today) {
        // Give 5 free credits daily
        userCredits += 5;
        updateCreditDisplay();
        localStorage.setItem('lastFreeCreditsDate', today);
        
        // Show a notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = '<p>You received 5 free daily credits!</p>';
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Add CSS for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 1000;
            transition: opacity 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});
