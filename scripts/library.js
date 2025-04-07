function initLibraryPage() {
    // API Endpoint - in production, this would be a real API endpoint
    const apiHost = getApiHost();
    const apiPath = '/stories';
    const apiUrl = apiHost + apiPath;
    
    // DOM Elements
    const storyGrid = document.getElementById('story-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-button');
    const storyCountEl = document.getElementById('story-count');
    const noResultsEl = document.getElementById('no-results');
    
    // Story data and state
    let stories = [];
    let activeFilter = 'all';
    let searchTerm = '';
    
    // Get search parameter from URL
    function getSearchParamFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('search');
    }
    
    // Update browser URL with search parameter
    function updateUrlWithSearchParam(term) {
        const url = new URL(window.location);
        if (term) {
            url.searchParams.set('search', term);
        } else {
            url.searchParams.delete('search');
        }
        window.history.replaceState({}, '', url);
    }
    
    // Modal Elements
    const storyModal = document.getElementById('story-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalAuthor = document.getElementById('modal-author');
    const modalDescription = document.getElementById('modal-description');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.getElementById('close-modal');
    
    // Load Stories
    function loadStories() {
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            stories = data;
            
            // Check if there's a search parameter in the URL
            const urlSearchTerm = getSearchParamFromUrl();
            if (urlSearchTerm && searchInput) {
                // Set search input value and update searchTerm variable
                searchInput.value = urlSearchTerm;
                searchTerm = urlSearchTerm;
            }
            
            renderStories(data);
          })
          .catch(error => {
            console.error('Error fetching stories:', error);
          });
    }
    
    // Generate HTML for a story card
    function createStoryCard(story) {
        return `
            <div class="book-card bg-white rounded-md-custom overflow-hidden shadow-md-custom transition duration-300 border border-gray-200/50 hover:shadow-lg-custom hover:border-lavender/30" data-id="${story.id}" data-author="${story.author}">
                <div class="relative overflow-hidden">
                    <img src="${apiHost}${story.cover_path}" alt="${story.title}" class="w-full h-56 object-cover book-cover" loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-text-dark/70 to-transparent flex items-end">
                        <div class="p-4 text-white">
                            <span class="text-xs font-semibold bg-peach px-2 py-1 rounded-full">${story.author}</span>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <h4 class="text-lg font-bold mb-2 line-clamp-1">${story.title}</h4>
                    <p class="text-text-medium text-sm mb-4 line-clamp-2">${story.description}</p>
                </div>
            </div>
        `;
    }
    
    // Render stories based on filter and search
    function renderStories(storyList) {
        // Filter stories
        let filteredStories = storyList;
        
        if (activeFilter !== 'all') {
            filteredStories = filteredStories.filter(story => 
                story.author.includes(activeFilter)
            );
        }
        
        // Search stories
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredStories = filteredStories.filter(story => 
                story.title.toLowerCase().includes(term) || 
                story.description.toLowerCase().includes(term) ||
                story.author.toLowerCase().includes(term)
            );
        }
        
        // Update story count
        storyCountEl.textContent = filteredStories.length;
        
        // Show/hide no results message
        if (filteredStories.length === 0) {
            storyGrid.innerHTML = '';
            noResultsEl.classList.remove('hidden');
        } else {
            noResultsEl.classList.add('hidden');
            
            // Render stories
            storyGrid.innerHTML = filteredStories.map(story => createStoryCard(story)).join('');
            
            // Add event listeners to story cards
            document.querySelectorAll('.book-card').forEach(card => {
                card.addEventListener('click', () => {
                    const storyId = parseInt(card.dataset.id);
                    const story = stories.find(s => s.id === storyId);
                    openStoryModal(story);
                });
            });
        }
    }
    
    // Open story modal
    function openStoryModal(story) {
        modalTitle.textContent = story.title;
        modalImage.src = apiHost + story.cover_path;
        modalImage.alt = story.title;
        modalAuthor.textContent = story.author;
        modalDescription.textContent = story.description;
        modalContent.textContent = story.content;
        
        storyModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    // Close story modal
    function closeStoryModal() {
        storyModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    if (closeModal) {
        closeModal.addEventListener('click', closeStoryModal);
        
        // Close modal when clicking outside
        storyModal.addEventListener('click', function(e) {
            if (e.target === storyModal) {
                closeStoryModal();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeStoryModal();
            }
        });
    }
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            activeFilter = button.dataset.filter;
            renderStories(stories);
        });
    });
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.trim();
            updateUrlWithSearchParam(searchTerm); // Update URL with search term
            renderStories(stories);
        });
    }
    
    // Initialize
    loadStories();
}

function getApiHost() {
    // Check if the current domain is dawnotemu.app or any subdomain of it
    const isDawnoTemuDomain = window.location.hostname === 'dawnotemu.app' || 
                              window.location.hostname.endsWith('.dawnotemu.app');
    
    if (isDawnoTemuDomain) {
        return 'https://api.dawnotemu.app'; // PROD
    } else {
        return 'http://localhost:8000'; // DEV
    }
}

// Run the library initialization if we're on the library page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('story-grid')) {
        initLibraryPage();
    }
});