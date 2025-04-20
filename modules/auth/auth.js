import { auth, githubProvider, googleProvider } from './firebase-config.js';

// DOM Elements
const authButtons = document.querySelector('.auth-buttons');
const mobileAuthButtons = document.querySelector('.mobile-auth-buttons');

// User state management
let currentUser = null;

// Initialize auth state listener
auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateAuthUI();
});

// Update UI based on auth state
function updateAuthUI() {
    if (currentUser) {
        // User is signed in
        const userProfile = `
            <div class="user-profile">
                <img src="${currentUser.photoURL || 'assets/default-avatar.png'}" alt="Profile" class="user-avatar">
                <span class="user-name">${currentUser.displayName}</span>
                <button class="btn btn-outline btn-glow" onclick="auth.signOut()">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Log out</span>
                </button>
            </div>
        `;
        authButtons.innerHTML = userProfile;
        mobileAuthButtons.innerHTML = userProfile;
        
        // Store user session
        localStorage.setItem('user', JSON.stringify({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL
        }));
    } else {
        // User is signed out
        const signInButtons = `
            <button class="btn btn-outline btn-glow" onclick="signInWithGoogle()">
                <i class="fas fa-sign-in-alt"></i>
                <span>Log in</span>
            </button>
            <button class="btn btn-primary btn-glow" onclick="window.location.href='signup.html'">
                <i class="fas fa-user-plus"></i>
                <span>Sign up</span>
            </button>
        `;
        authButtons.innerHTML = signInButtons;
        mobileAuthButtons.innerHTML = signInButtons;
        
        // Clear user session
        localStorage.removeItem('user');
    }
}

// Sign in with Google
async function signInWithGoogle() {
    try {
        await auth.signInWithPopup(googleProvider);
    } catch (error) {
        console.error('Google sign-in error:', error);
        showAuthError(error.message);
    }
}

// Sign in with GitHub
async function signInWithGithub() {
    try {
        await auth.signInWithPopup(githubProvider);
    } catch (error) {
        console.error('GitHub sign-in error:', error);
        showAuthError(error.message);
    }
}

// Show authentication error
function showAuthError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Export functions for global use
window.signInWithGoogle = signInWithGoogle;
window.signInWithGithub = signInWithGithub;

// Auth Module JavaScript
class AuthModule {
    constructor() {
        this.authContainer = document.querySelector('.auth-container');
        this.authButtons = document.querySelector('.auth-buttons');
        this.mobileAuthButtons = document.querySelector('.mobile-auth-buttons');
        this.userProfile = document.querySelector('.user-profile');
        this.userAvatar = document.querySelector('.user-avatar');
        this.userName = document.querySelector('.user-name');
        this.authError = document.querySelector('.auth-error');
        this.errorMessage = document.querySelector('.error-message');

        // Set up auth state listener
        this.setupAuthStateListener();
        // Set up responsive auth buttons
        this.setupResponsiveAuth();
        // Check for existing session
        this.checkSession();
    }

    setupAuthStateListener() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.handleUserSignIn(user);
            } else {
                this.handleUserSignOut();
            }
        });
    }

    setupResponsiveAuth() {
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                this.authButtons.style.display = 'none';
                this.mobileAuthButtons.style.display = 'flex';
            } else {
                this.authButtons.style.display = 'flex';
                this.mobileAuthButtons.style.display = 'none';
            }
        };

        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    }

    checkSession() {
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            const user = JSON.parse(userSession);
            this.handleUserSignIn(user);
        }
    }

    handleUserSignIn(user) {
        // Store user session
        const userSession = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        };
        localStorage.setItem('userSession', JSON.stringify(userSession));

        // Update UI
        this.showUserProfile(user);
    }

    handleUserSignOut() {
        // Clear user session
        localStorage.removeItem('userSession');
        // Update UI
        this.showAuthButtons();
    }

    showUserProfile(user) {
        this.authButtons.style.display = 'none';
        this.mobileAuthButtons.style.display = 'none';
        this.userProfile.style.display = 'flex';
        
        this.userAvatar.src = user.photoURL || 'assets/images/default-avatar.png';
        this.userName.textContent = user.displayName || 'User';
    }

    showAuthButtons() {
        this.userProfile.style.display = 'none';
        if (window.innerWidth <= 768) {
            this.mobileAuthButtons.style.display = 'flex';
        } else {
            this.authButtons.style.display = 'flex';
        }
    }

    async signInWithGoogle() {
        try {
            await auth.signInWithPopup(googleProvider);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async signInWithGithub() {
        try {
            await auth.signInWithPopup(githubProvider);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async signOut() {
        try {
            await auth.signOut();
        } catch (error) {
            this.showError(error.message);
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.authError.style.display = 'flex';
        
        setTimeout(() => {
            this.authError.style.display = 'none';
        }, 5000);
    }
}

// Initialize the auth module when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthModule();
}); 