// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-nav-links a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
    });
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

// Code editor functionality
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const runCodeBtn = document.getElementById('run-code');

// Update line numbers when code changes
codeInput.addEventListener('input', updateLineNumbers);

function updateLineNumbers() {
    const lines = codeInput.value.split('\n');
    const lineNumbers = document.querySelector('.line-numbers');
    
    // Clear existing line numbers
    lineNumbers.innerHTML = '';
    
    // Add new line numbers
    for (let i = 1; i <= lines.length; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        lineNumbers.appendChild(span);
    }
}

// Run code functionality
runCodeBtn.addEventListener('click', () => {
    const code = codeInput.value;
    
    // Change button text
    runCodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...';
    codeOutput.textContent = 'Running code...';
    
    // Simulate code execution with a delay
    setTimeout(() => {
        try {
            // Create a safe evaluation environment
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
                        output: 'All tests passed! Great job!\\n\\nfindMaxNumber([1, 3, 5, 2, 4]) → 5\\nfindMaxNumber([9, 3, 7, 1]) → 9\\nfindMaxNumber([-1, -5, -2]) → -1' 
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
            codeOutput.textContent = result.output;
            codeOutput.className = result.success ? 'success' : 'error';
            
            // Reset button
            runCodeBtn.innerHTML = result.success ? 
                '<i class="fa-solid fa-check"></i> Success' : 
                '<i class="fa-solid fa-play"></i> Run Code';
            
            if (result.success) {
                runCodeBtn.classList.add('success');
                setTimeout(() => {
                    runCodeBtn.classList.remove('success');
                    runCodeBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
                }, 3000);
            }
        } catch (error) {
            codeOutput.textContent = `Error: ${error.message}`;
            codeOutput.className = 'error';
            runCodeBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
        }
    }, 1000);
});

// Initialize line numbers
updateLineNumbers();