/**
 * Story Idea Generator - Frontend
 * Client-side logic for story generation
 */

// Auto-detect API base URL
const API_BASE_URL = window.location.origin;


// DOM Elements
const genreSelect = document.getElementById('genre');
const themeSelect = document.getElementById('theme');
const numberOfIdeasSelect = document.getElementById('numberOfIdeas');
const generateBtn = document.getElementById('generateBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const ideasSection = document.getElementById('ideasSection');
const ideasContainer = document.getElementById('ideasContainer');
const feedbackSection = document.getElementById('feedbackSection');
const submitFeedbackBtn = document.getElementById('submitFeedback');
const helpfulSelect = document.getElementById('helpfulSelect');
const commentsTextarea = document.getElementById('comments');

let currentGenre = '';
let currentTheme = '';
let currentIdeas = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    setupEventListeners();
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    genreSelect.addEventListener('change', handleGenreChange);
    themeSelect.addEventListener('change', () => {
        generateBtn.disabled = !themeSelect.value;
    });
    generateBtn.addEventListener('click', handleGenerateClick);
    submitFeedbackBtn.addEventListener('click', handleSubmitFeedback);
}

// ============================================
// API CALLS
// ============================================

async function loadGenres() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/genres`);
        const data = await response.json();

        if (data.success) {
            genreSelect.innerHTML = '<option value="">-- Choose a Genre --</option>';
            data.genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
                genreSelect.appendChild(option);
            });
        } else {
            showError('Failed to load genres');
        }
    } catch (error) {
        showError('Error loading genres: ' + error.message);
    }
}

async function loadThemes(genre) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/themes/${genre}`);
        const data = await response.json();

        if (data.success) {
            themeSelect.innerHTML = '<option value="">-- Choose a Theme --</option>';
            data.themes.forEach(theme => {
                const option = document.createElement('option');
                option.value = theme;
                option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1).replace(/_/g, ' ');
                themeSelect.appendChild(option);
            });
            themeSelect.disabled = false;
        } else {
            showError(data.error || 'Failed to load themes');
        }
    } catch (error) {
        showError('Error loading themes: ' + error.message);
    }
}

async function generateStories() {
    const genre = genreSelect.value;
    const theme = themeSelect.value;
    const numberOfIdeas = parseInt(numberOfIdeasSelect.value);

    if (!genre || !theme) {
        showError('Please select both genre and theme');
        return;
    }

    showLoading(true);
    hideError();
    ideasSection.classList.add('hidden');
    feedbackSection.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-story`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ genre, theme, numberOfIdeas })
        });

        const data = await response.json();

        if (data.success) {
            currentGenre = genre;
            currentTheme = theme;
            currentIdeas = data.generatedIdeas;
            displayIdeas(data.generatedIdeas);
            ideasSection.classList.remove('hidden');
            feedbackSection.classList.remove('hidden');
            window.scrollTo(0, ideasSection.offsetTop - 100);
        } else {
            showError(data.error || 'Failed to generate stories');
        }
    } catch (error) {
        showError('Error generating stories: ' + error.message);
    } finally {
        showLoading(false);
    }
}

async function submitFeedback() {
    const helpful = helpfulSelect.value;
    const comments = commentsTextarea.value;

    if (!helpful || currentIdeas.length === 0) {
        showError('Please provide feedback');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                genre: currentGenre,
                theme: currentTheme,
                idea: currentIdeas[0],
                helpful,
                comments
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('✅ Thank you for your feedback!');
            helpfulSelect.value = '';
            commentsTextarea.value = '';
        } else {
            showError('Failed to submit feedback');
        }
    } catch (error) {
        showError('Error submitting feedback: ' + error.message);
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleGenreChange() {
    const genre = genreSelect.value;
    if (genre) {
        loadThemes(genre);
        generateBtn.disabled = true;
    } else {
        themeSelect.disabled = true;
        themeSelect.innerHTML = '<option value="">-- First, select a genre --</option>';
        generateBtn.disabled = true;
    }
}

function handleGenerateClick() {
    generateStories();
}

function handleSubmitFeedback() {
    submitFeedback();
}

// ============================================
// UI HELPERS
// ============================================

function displayIdeas(ideas) {
    ideasContainer.innerHTML = '';
    ideas.forEach((idea, index) => {
        const card = document.createElement('div');
        card.className = 'idea-card';
        card.innerHTML = `
            <h3>Story Idea #${index + 1}</h3>
            <p>${idea}</p>
            <div class="idea-actions">
                <button class="btn-small" onclick="copyToClipboard('${idea.replace(/'/g, "\\'")}')">
                    📋 Copy
                </button>
            </div>
        `;
        ideasContainer.appendChild(card);
    });
}

function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Story idea copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}
