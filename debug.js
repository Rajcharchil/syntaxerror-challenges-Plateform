class DebugPanel {
    constructor() {
        this.panel = document.getElementById('debugPanel');
        this.toggle = document.getElementById('debugToggle');
        this.output = document.getElementById('debugOutput');
        this.errorList = document.getElementById('errorList');
        this.tabs = document.querySelectorAll('.debug-tab');
        this.tabContents = document.querySelectorAll('.debug-body > div');
        
        this.setupEventListeners();
        this.initializeComponents();
    }

    setupEventListeners() {
        this.toggle.addEventListener('click', () => this.togglePanel());
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });

        // Override console methods
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn
        };

        console.log = (...args) => {
            originalConsole.log(...args);
            this.logToPanel('log', ...args);
        };

        console.error = (...args) => {
            originalConsole.error(...args);
            this.logToPanel('error', ...args);
            this.addError(...args);
        };

        console.warn = (...args) => {
            originalConsole.warn(...args);
            this.logToPanel('warn', ...args);
        };
    }

    togglePanel() {
        this.panel.classList.toggle('collapsed');
    }

    switchTab(tab) {
        const tabName = tab.dataset.tab;
        this.tabs.forEach(t => t.classList.remove('active'));
        this.tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.querySelector(`.debug-${tabName}`).classList.add('active');
    }

    logToPanel(type, ...args) {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        this.output.appendChild(logEntry);
        this.output.scrollTop = this.output.scrollHeight;
    }

    addError(...args) {
        const errorItem = document.createElement('div');
        errorItem.className = 'error-item';
        errorItem.textContent = args.join(' ');
        this.errorList.appendChild(errorItem);
    }

    async initializeComponents() {
        const components = {
            auth: document.getElementById('authStatus'),
            editor: document.getElementById('editorStatus'),
            challenges: document.getElementById('challengesStatus'),
            nav: document.getElementById('navStatus')
        };

        // Check Authentication
        try {
            const auth = await this.checkAuth();
            components.auth.textContent = auth ? 'Working' : 'Not Initialized';
            components.auth.className = `component-status ${auth ? 'working' : 'error'}`;
        } catch (error) {
            components.auth.textContent = 'Error';
            components.auth.className = 'component-status error';
        }

        // Check Code Editor
        try {
            const editor = await this.checkEditor();
            components.editor.textContent = editor ? 'Working' : 'Not Initialized';
            components.editor.className = `component-status ${editor ? 'working' : 'error'}`;
        } catch (error) {
            components.editor.textContent = 'Error';
            components.editor.className = 'component-status error';
        }

        // Check Challenges
        try {
            const challenges = await this.checkChallenges();
            components.challenges.textContent = challenges ? 'Working' : 'Not Initialized';
            components.challenges.className = `component-status ${challenges ? 'working' : 'error'}`;
        } catch (error) {
            components.challenges.textContent = 'Error';
            components.challenges.className = 'component-status error';
        }

        // Check Navigation
        try {
            const nav = await this.checkNavigation();
            components.nav.textContent = nav ? 'Working' : 'Not Initialized';
            components.nav.className = `component-status ${nav ? 'working' : 'error'}`;
        } catch (error) {
            components.nav.textContent = 'Error';
            components.nav.className = 'component-status error';
        }
    }

    async checkAuth() {
        return new Promise((resolve) => {
            const authContainer = document.querySelector('.auth-container');
            if (!authContainer) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    }

    async checkEditor() {
        return new Promise((resolve) => {
            const editor = document.getElementById('code-editor');
            if (!editor) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    }

    async checkChallenges() {
        return new Promise((resolve) => {
            const challenges = document.querySelector('.challenges-grid');
            if (!challenges) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    }

    async checkNavigation() {
        return new Promise((resolve) => {
            const nav = document.querySelector('.nav-links');
            if (!nav) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    }

    highlightComponent(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('component-highlight');
            setTimeout(() => {
                element.classList.remove('component-highlight');
            }, 3000);
        }
    }
}

// Initialize debug panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.debugPanel = new DebugPanel();
}); 