class AIFeedback {
    constructor() {
        this.modal = document.querySelector('.ai-feedback-modal');
        this.chatContainer = this.modal.querySelector('.ai-chat-container');
        this.input = this.modal.querySelector('textarea');
        this.sendButton = this.modal.querySelector('.send-message');
        this.closeButton = this.modal.querySelector('.close-modal');
        
        this.initialize();
    }

    initialize() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Auto-resize textarea
        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = this.input.scrollHeight + 'px';
        });
    }

    showModal() {
        this.modal.classList.add('active');
        this.input.focus();
    }

    closeModal() {
        this.modal.classList.remove('active');
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.input.value = '';
        this.input.style.height = 'auto';

        // Show loading state
        const loadingMessage = this.addMessage('Thinking...', 'ai', true);
        
        try {
            // Simulate AI response (replace with actual API call)
            const response = await this.getAIResponse(message);
            loadingMessage.remove();
            this.addMessage(response, 'ai');
        } catch (error) {
            loadingMessage.remove();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('AI response error:', error);
        }
    }

    addMessage(content, sender, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message${isLoading ? ' loading' : ''}`;
        
        if (isLoading) {
            messageDiv.innerHTML = `
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
        } else {
            messageDiv.textContent = content;
        }
        
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        return messageDiv;
    }

    async getAIResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Replace with actual API call
        return "This is a simulated AI response. In a real implementation, this would call an AI API to generate a response based on the user's message.";
    }
}

// Initialize AI feedback when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiFeedback = new AIFeedback();
}); 