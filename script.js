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

// Enhanced Tab and Output Display Functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const codeArea = document.getElementById('code-area');
const outputArea = document.getElementById('output-area');
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const runCodeBtn = document.getElementById('run-code');

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
        // Add fade-in animation
        outputArea.style.opacity = '0';
        setTimeout(() => {
            outputArea.style.opacity = '1';
        }, 50);
    }
}

// Tab click handlers
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('tab-ripple');
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 1000);
        
        switchTab(button.dataset.tab);
    });
});

// Run code button handler
runCodeBtn.addEventListener('click', function() {
    // Show output area immediately
    outputArea.style.display = 'block';
    outputArea.style.opacity = '1';
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
        const findMaxNumberSolution = new Function(
            `
            try {
                ${code}
                
                // Test the implementation
                const test1 = findMaxNumber([1, 3, 5, 2, 4]);
                const test2 = findMaxNumber([9, 3, 7, 1]);
                const test3 = findMaxNumber([-1, -5, -2]);
                
                if (test1 !== 5 || test2 !== 9 || test3 !== -1) {
                    return { 
                        success: false, 
                        output: 'Tests failed. Make sure your function returns the maximum number in the array.' 
                    };
                }
                
                return { 
                    success: true, 
                    output: 'All tests passed! Great job!\\n\\nTest Results:\\nfindMaxNumber([1, 3, 5, 2, 4]) → 5\\nfindMaxNumber([9, 3, 7, 1]) → 9\\nfindMaxNumber([-1, -5, -2]) → -1' 
                };
            } catch (error) {
                return { 
                    success: false, 
                    output: 'Error: ' + error.message 
                };
            }
            `
        );

        const result = findMaxNumberSolution();
        
        // Update output immediately
        codeOutput.textContent = result.output;
        codeOutput.className = result.success ? 'success' : 'error';
        
        // Update button state
        if (result.success) {
            runCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Success';
            runCodeBtn.classList.add('success');
            setTimeout(() => {
                runCodeBtn.classList.remove('success');
                runCodeBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
            }, 2000);
        } else {
            runCodeBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
        }
        
    } catch (error) {
        // Show error in output
        codeOutput.textContent = `Error: ${error.message}`;
        codeOutput.className = 'error';
        runCodeBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
    }
});

// Make sure output area is properly initialized
document.addEventListener('DOMContentLoaded', function() {
    // Initialize output area
    outputArea.style.opacity = '0';
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