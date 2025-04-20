// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Header Scroll Effects
const header = document.querySelector('.main-header');
const progressBar = document.querySelector('.progress-bar');

window.addEventListener('scroll', () => {
    // Add scrolled class to header
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const menuIcon = document.querySelector('.menu-icon');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const mobileMenuLinks = document.querySelectorAll('.mobile-nav-links a');

function toggleMenu() {
    menuIcon.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

menuBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Link Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Code Editor Functionality
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const runCodeBtn = document.getElementById('run-code');
const outputArea = document.getElementById('output-area');
const codeArea = document.getElementById('code-area');
const tabButtons = document.querySelectorAll('.tab-btn');

// Function to switch tabs
function switchTab(tabName) {
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    if (tabName === 'code') {
        codeArea.style.display = 'block';
        outputArea.style.display = 'none';
    } else {
        codeArea.style.display = 'none';
        outputArea.style.display = 'block';
    }
}

// Tab click handlers
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchTab(button.dataset.tab);
    });
});

// Run code button handler
runCodeBtn.addEventListener('click', function() {
    // Show output area immediately
    outputArea.style.display = 'block';
    codeArea.style.display = 'none';
    
    // Activate output tab
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === 'output') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Show initial loading state
    codeOutput.textContent = 'Executing code...';
    codeOutput.className = '';
    runCodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...';

    // Execute code immediately
    try {
        const code = codeInput.value;
        let output = '';
        
        // Override console.log to capture output
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            output += args.map(arg => {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                }
                return arg;
            }).join(' ') + '\n';
        };

        // Create a safe environment for code execution
        const safeEval = new Function('console', `
            ${code}
            
            // Test the implementation
            const test1 = findMaxNumber([1, 3, 5, 2, 4]);
            const test2 = findMaxNumber([9, 3, 7, 1]);
            const test3 = findMaxNumber([-1, -5, -2]);
            
            console.log('Test Results:');
            console.log('findMaxNumber([1, 3, 5, 2, 4]) → ' + test1);
            console.log('findMaxNumber([9, 3, 7, 1]) → ' + test2);
            console.log('findMaxNumber([-1, -5, -2]) → ' + test3);
            
            if (test1 === 5 && test2 === 9 && test3 === -1) {
                console.log('\\nAll tests passed! Great job!');
            } else {
                console.log('\\nSome tests failed. Please check your implementation.');
            }
        `);
        
        safeEval(console);
        
        // Restore original console.log
        console.log = originalConsoleLog;
        
        // Update output
        codeOutput.textContent = output || 'No output to display';
        codeOutput.className = 'success';
        
        // Update button state
        runCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Success';
        runCodeBtn.classList.add('success');
        setTimeout(() => {
            runCodeBtn.classList.remove('success');
            runCodeBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
        }, 2000);
        
    } catch (error) {
        // Show error in output
        codeOutput.textContent = `Error: ${error.message}`;
        codeOutput.className = 'error';
        runCodeBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
    }
});

// Initialize code editor
document.addEventListener('DOMContentLoaded', function() {
    // Initialize output area
    outputArea.style.display = 'none';
    codeArea.style.display = 'block';
    
    // Initialize tabs
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === 'code');
    });
});

// Double-click handler for output area to switch back to code
outputArea.addEventListener('dblclick', () => {
    switchTab('code');
});

// Keyboard shortcut for running code (Ctrl/Cmd + Enter)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        runCodeBtn.click();
    }
});

// Challenge filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const challengeCards = document.querySelectorAll('.challenge-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Filter challenge cards
        challengeCards.forEach(card => {
            if (filter === 'all' || card.dataset.difficulty === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Auth Button Toggle Functionality
const authButtons = document.querySelector('.auth-buttons');
const userProfile = document.querySelector('.user-profile');

// Function to toggle auth buttons
function toggleAuthButtons() {
    if (authButtons.classList.contains('active')) {
        // Close animation
        authButtons.classList.add('closing');
        setTimeout(() => {
            authButtons.classList.remove('active', 'closing');
        }, 300); // Match animation duration
    } else {
        // Open animation
        authButtons.classList.add('active');
    }
}

// Close auth buttons when clicking outside
document.addEventListener('click', (e) => {
    const isClickInside = authButtons.contains(e.target) || 
                         e.target.closest('.auth-toggle-btn');
    
    if (!isClickInside && authButtons.classList.contains('active')) {
        toggleAuthButtons();
    }
});

// Handle mobile menu button click
document.querySelector('.mobile-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click handler
    toggleAuthButtons();
});

// Remove focus outline after click
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', function(e) {
        e.preventDefault(); // Prevent default focus ring
    });
});

// Debug Panel Functionality
class DebugPanel {
    constructor() {
        this.panel = document.querySelector('.debug-panel');
        this.toggleButton = document.querySelector('.debug-toggle');
        this.closeButton = document.querySelector('.debug-close');
        this.tabs = document.querySelectorAll('.debug-tab');
        this.tabContents = document.querySelectorAll('.debug-console, .debug-components, .debug-errors');
        this.isExpanded = false;

        if (!this.panel || !this.toggleButton) {
            console.error('Debug panel elements not found');
            return;
        }

        // Ensure toggle button is visible
        this.toggleButton.style.display = 'flex';
        this.toggleButton.style.position = 'fixed';
        this.toggleButton.style.bottom = '20px';
        this.toggleButton.style.right = '20px';
        this.toggleButton.style.zIndex = '10000';

        this.initialize();
    }

    initialize() {
        // Add event listeners
        this.toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel();
        });
        
        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel();
        });
        
        // Add tab switching functionality
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.stopPropagation();
                this.switchTab(tab);
            });
        });

        // Initialize with console tab active
        this.switchTab(this.tabs[0]);

        // Add click outside handler
        document.addEventListener('click', (e) => {
            if (this.isExpanded && !this.panel.contains(e.target)) {
                this.togglePanel();
            }
        });
    }

    togglePanel() {
        this.isExpanded = !this.isExpanded;
        this.panel.classList.toggle('expanded', this.isExpanded);
        
        if (this.isExpanded) {
            this.toggleButton.style.display = 'none';
            this.panel.style.display = 'block';
        } else {
            this.toggleButton.style.display = 'flex';
            setTimeout(() => {
                if (!this.isExpanded) {
                    this.panel.style.display = 'none';
                }
            }, 300);
        }
    }

    switchTab(selectedTab) {
        if (!selectedTab) return;
        
        // Remove active class from all tabs and contents
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab
        selectedTab.classList.add('active');

        // Show corresponding content
        const tabName = selectedTab.getAttribute('data-tab');
        const content = document.querySelector(`.${tabName}`);
        if (content) {
            content.classList.add('active');
        }
    }

    log(message) {
        const output = document.getElementById('debugOutput');
        if (!output) return;
        
        const timestamp = new Date().toLocaleTimeString();
        output.innerHTML += `[${timestamp}] ${message}\n`;
        output.scrollTop = output.scrollHeight;
    }

    updateComponentStatus(componentId, status) {
        const component = document.querySelector(`[data-component="${componentId}"]`);
        if (component) {
            const statusElement = component.querySelector('.component-status');
            if (statusElement) {
                statusElement.textContent = status;
                statusElement.className = `component-status ${status.toLowerCase()}`;
            }
        }
    }

    addError(message) {
        const errorList = document.querySelector('.error-list');
        if (!errorList) return;
        
        const errorItem = document.createElement('div');
        errorItem.className = 'error-item';
        errorItem.textContent = message;
        errorList.appendChild(errorItem);
    }
}

// Initialize debug panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.debugPanel = new DebugPanel();
    
    // Example usage
    if (window.debugPanel) {
        debugPanel.log('Debug panel initialized');
        debugPanel.updateComponentStatus('auth', 'working');
        debugPanel.updateComponentStatus('editor', 'checking');
    }
});

// Component initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeComponents();
    
    // Log initialization
    console.log('Application initialized');
});

function initializeComponents() {
    // Check and log each component
    checkAuth();
    checkEditor();
    checkChallenges();
    checkNavigation();
}

function checkAuth() {
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
        console.log('Authentication component initialized');
        window.debugPanel.highlightComponent('.auth-container');
    } else {
        console.error('Authentication component not found');
    }
}

function checkEditor() {
    const editor = document.getElementById('code-editor');
    if (editor) {
        console.log('Code editor initialized');
        window.debugPanel.highlightComponent('#code-editor');
    } else {
        console.error('Code editor not found');
    }
}

function checkChallenges() {
    const challenges = document.querySelector('.challenges-grid');
    if (challenges) {
        console.log('Challenges component initialized');
        window.debugPanel.highlightComponent('.challenges-grid');
    } else {
        console.error('Challenges component not found');
    }
}

function checkNavigation() {
    const nav = document.querySelector('.nav-links');
    if (nav) {
        console.log('Navigation component initialized');
        window.debugPanel.highlightComponent('.nav-links');
    } else {
        console.error('Navigation component not found');
    }
}

// Error handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error:', msg, '\nURL:', url, '\nLine:', lineNo, '\nColumn:', columnNo, '\nError object:', error);
    return false;
};

// Component status monitoring
setInterval(() => {
    checkAuth();
    checkEditor();
    checkChallenges();
    checkNavigation();
}, 5000); // Check every 5 seconds