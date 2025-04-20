import * as monaco from 'monaco-editor';
import userManager from '../user/user.js';

class CodeEditor {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            ...options
        };
        
        this.editor = null;
        this.currentChallengeId = null;
        this.setupEditor();
        this.setupThemeToggle();
        this.setupAutoSave();
    }

    setupEditor() {
        this.editor = monaco.editor.create(this.container, this.options);
        
        // Load saved code if exists
        this.loadSavedCode();
        
        // Handle editor changes
        this.editor.onDidChangeModelContent(() => {
            this.autoSaveCode();
        });
    }

    setupThemeToggle() {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <button class="theme-btn" id="themeToggle">
                <img src="assets/images/${this.options.theme === 'vs-dark' ? 'sun.svg' : 'moon.svg'}" 
                     alt="Toggle Theme">
            </button>
        `;
        
        document.body.appendChild(themeToggle);
        
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        const newTheme = this.options.theme === 'vs-dark' ? 'vs-light' : 'vs-dark';
        monaco.editor.setTheme(newTheme);
        this.options.theme = newTheme;
        
        // Update theme button icon
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.innerHTML = `
            <img src="assets/images/${newTheme === 'vs-dark' ? 'sun.svg' : 'moon.svg'}" 
                 alt="Toggle Theme">
        `;
        
        // Save theme preference
        localStorage.setItem('editorTheme', newTheme);
    }

    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.autoSaveCode();
        }, 30000);
    }

    autoSaveCode() {
        if (!this.currentChallengeId) return;
        
        const code = this.editor.getValue();
        const user = userManager.user;
        
        if (user) {
            // Save to Firebase if user is logged in
            this.saveCodeToFirebase(code);
        } else {
            // Save to localStorage if not logged in
            this.saveCodeToLocalStorage(code);
        }
    }

    async saveCodeToFirebase(code) {
        try {
            const userRef = doc(db, 'users', userManager.user.uid);
            const codeRef = doc(collection(userRef, 'savedCode'), this.currentChallengeId);
            
            await setDoc(codeRef, {
                code,
                lastSaved: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving code to Firebase:', error);
        }
    }

    saveCodeToLocalStorage(code) {
        const savedCode = JSON.parse(localStorage.getItem('savedCode') || '{}');
        savedCode[this.currentChallengeId] = {
            code,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('savedCode', JSON.stringify(savedCode));
    }

    async loadSavedCode() {
        if (!this.currentChallengeId) return;
        
        const user = userManager.user;
        let savedCode = null;
        
        if (user) {
            // Load from Firebase if user is logged in
            savedCode = await this.loadCodeFromFirebase();
        } else {
            // Load from localStorage if not logged in
            savedCode = this.loadCodeFromLocalStorage();
        }
        
        if (savedCode) {
            this.editor.setValue(savedCode);
        }
    }

    async loadCodeFromFirebase() {
        try {
            const userRef = doc(db, 'users', userManager.user.uid);
            const codeRef = doc(collection(userRef, 'savedCode'), this.currentChallengeId);
            const codeSnap = await getDoc(codeRef);
            
            return codeSnap.exists() ? codeSnap.data().code : null;
        } catch (error) {
            console.error('Error loading code from Firebase:', error);
            return null;
        }
    }

    loadCodeFromLocalStorage() {
        const savedCode = JSON.parse(localStorage.getItem('savedCode') || '{}');
        return savedCode[this.currentChallengeId]?.code || null;
    }

    setChallenge(challengeId, initialCode = '') {
        this.currentChallengeId = challengeId;
        this.editor.setValue(initialCode);
        this.loadSavedCode();
    }

    getValue() {
        return this.editor.getValue();
    }

    setValue(value) {
        this.editor.setValue(value);
    }

    dispose() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
}

export default CodeEditor; 