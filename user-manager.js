// UserManager - Professional User Authentication & Data Management System
// Handles signup, signin, session management, and persistent user data storage

class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.sessionKey = 'samcrypto_session';
        this.usersKey = 'samcrypto_users';
        
        // Initialize authentication state
        this.initializeAuth();
        this.setupEventListeners();
    }

    // Load all users from localStorage (JSON storage)
    loadUsers() {
        try {
            const usersData = localStorage.getItem(this.usersKey);
            return usersData ? JSON.parse(usersData) : {};
        } catch (error) {
            console.error('Error loading users:', error);
            return {};
        }
    }

    // Save users to localStorage
    saveUsers() {
        try {
            localStorage.setItem(this.usersKey, JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    // Initialize authentication on page load
    initializeAuth() {
        const session = this.getSession();
        if (session && session.userId && this.users[session.userId]) {
            this.currentUser = this.users[session.userId];
            this.updateUIForLoggedInUser();
        } else {
            this.updateUIForLoggedOutUser();
            // Auto-show signup for first-time visitors
            this.checkForFirstTimeVisitor();
        }
    }

    // Check if this is a first-time visitor and show signup
    checkForFirstTimeVisitor() {
        const hasVisited = localStorage.getItem('samcrypto_visited');
        const hasUsers = Object.keys(this.users).length > 0;
        
        if (!hasVisited && !hasUsers) {
            // Mark as visited
            localStorage.setItem('samcrypto_visited', 'true');
            
            // Show signup modal after a short delay for better UX
            setTimeout(() => {
                this.showRegisterModal();
                this.showMessage('Welcome to SamCrypto AI! Create your account to get started with personalized crypto trading advice! 🚀', 'info');
            }, 1500);
        }
    }

    // Get current session
    getSession() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    }

    // Set user session
    setSession(userId, rememberMe = false) {
        const session = {
            userId: userId,
            loginTime: Date.now(),
            expiresAt: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000), // 30 days or 1 day
            rememberMe: rememberMe
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
    }

    // Clear user session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
    }

    // Generate user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Hash password (simple hash for demo - use bcrypt in production)
    hashPassword(password) {
        // Simple hash function - in production, use proper bcrypt
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password) {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return { valid: false, message: 'Password must contain uppercase, lowercase, and number' };
        }
        return { valid: true };
    }

    // Register new user
    async register(name, email, password, confirmPassword) {
        try {
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                throw new Error('All fields are required');
            }

            if (!this.validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const passwordValidation = this.validatePassword(password);
            if (!passwordValidation.valid) {
                throw new Error(passwordValidation.message);
            }

            // Check if user already exists
            const existingUser = Object.values(this.users).find(user => user.email === email);
            if (existingUser) {
                throw new Error('An account with this email already exists');
            }

            // Create new user
            const userId = this.generateUserId();
            const hashedPassword = this.hashPassword(password);
            
            const newUser = {
                id: userId,
                name: name,
                email: email,
                password: hashedPassword,
                createdAt: Date.now(),
                lastLogin: Date.now(),
                
                // User preferences
                preferences: {
                    riskTolerance: 'medium',
                    tradingExperience: 'beginner',
                    preferredCurrency: 'USD',
                    apiKey: null
                },
                
                // Trading data
                portfolio: {
                    totalValue: 0,
                    totalPnL: 0,
                    totalPnLPercent: 0,
                    holdings: []
                },
                
                // Alerts
                alerts: [],
                
                // Chat history
                chatHistory: [],
                
                // Conversation memory (like ChatGPT)
                conversationMemory: {
                    userContext: {},
                    preferences: {},
                    pastConversations: [],
                    learnings: {}
                },
                
                // User statistics
                stats: {
                    totalTrades: 0,
                    successfulTrades: 0,
                    totalProfit: 0,
                    joinDate: Date.now(),
                    lastActive: Date.now()
                }
            };

            // Save user
            this.users[userId] = newUser;
            this.saveUsers();

            // Auto-login after registration
            this.currentUser = newUser;
            this.setSession(userId, false);
            this.updateUIForLoggedInUser();

            this.showMessage('Account created successfully! Welcome to SamCrypto AI!', 'success');
            this.closeModals();

            return { success: true, user: newUser };

        } catch (error) {
            this.showMessage(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Login existing user
    async login(email, password, rememberMe = false) {
        try {
            // Validation
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (!this.validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Find user
            const user = Object.values(this.users).find(u => u.email === email);
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Check password
            const hashedPassword = this.hashPassword(password);
            if (user.password !== hashedPassword) {
                throw new Error('Invalid email or password');
            }

            // Update last login
            user.lastLogin = Date.now();
            user.stats.lastActive = Date.now();
            this.saveUsers();

            // Set session
            this.currentUser = user;
            this.setSession(user.id, rememberMe);
            this.updateUIForLoggedInUser();

            this.showMessage(`Welcome back, ${user.name}!`, 'success');
            this.closeModals();

            return { success: true, user: user };

        } catch (error) {
            this.showMessage(error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Logout user
    logout() {
        if (this.currentUser) {
            // Update last active time
            this.currentUser.stats.lastActive = Date.now();
            this.saveUsers();
            
            this.currentUser = null;
            this.clearSession();
            this.updateUIForLoggedOutUser();
            
            this.showMessage('Logged out successfully', 'success');
            
            // Refresh the page to reset all data
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    // Update user profile
    updateProfile(profileData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            // Update user data
            if (profileData.name) this.currentUser.name = profileData.name;
            if (profileData.riskTolerance) this.currentUser.preferences.riskTolerance = profileData.riskTolerance;
            if (profileData.tradingExperience) this.currentUser.preferences.tradingExperience = profileData.tradingExperience;
            if (profileData.preferredCurrency) this.currentUser.preferences.preferredCurrency = profileData.preferredCurrency;
            if (profileData.apiKey !== undefined) this.currentUser.preferences.apiKey = profileData.apiKey;

            // Save to storage
            this.users[this.currentUser.id] = this.currentUser;
            this.saveUsers();

            this.showMessage('Profile updated successfully!', 'success');
            return { success: true };

        } catch (error) {
            this.showMessage('Error updating profile: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Save user's portfolio data
    saveUserPortfolio(portfolio) {
        if (!this.currentUser) return;
        
        this.currentUser.portfolio = portfolio;
        this.users[this.currentUser.id] = this.currentUser;
        this.saveUsers();
    }

    // Save user's alerts
    saveUserAlerts(alerts) {
        if (!this.currentUser) return;
        
        this.currentUser.alerts = alerts;
        this.users[this.currentUser.id] = this.currentUser;
        this.saveUsers();
    }

    // Save chat history
    saveChatHistory(history) {
        if (!this.currentUser) return;
        
        this.currentUser.chatHistory = history;
        this.users[this.currentUser.id] = this.currentUser;
        this.saveUsers();
    }

    // Update conversation memory (like ChatGPT memory)
    updateConversationMemory(type, data) {
        if (!this.currentUser) return;
        
        const memory = this.currentUser.conversationMemory;
        
        switch (type) {
            case 'context':
                Object.assign(memory.userContext, data);
                break;
            case 'preferences':
                Object.assign(memory.preferences, data);
                break;
            case 'conversation':
                memory.pastConversations.push({
                    timestamp: Date.now(),
                    data: data
                });
                // Keep only last 50 conversations
                if (memory.pastConversations.length > 50) {
                    memory.pastConversations = memory.pastConversations.slice(-50);
                }
                break;
            case 'learning':
                Object.assign(memory.learnings, data);
                break;
        }
        
        this.users[this.currentUser.id] = this.currentUser;
        this.saveUsers();
    }

    // Get user's conversation memory
    getConversationMemory() {
        if (!this.currentUser) return null;
        return this.currentUser.conversationMemory;
    }

    // Export user data
    exportUserData() {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const exportData = {
            user: this.currentUser,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `samcrypto_data_${this.currentUser.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showMessage('Data exported successfully!', 'success');
    }

    // Update UI for logged in user
    updateUIForLoggedInUser() {
        if (!this.currentUser) return;

        // Show user profile section
        const userProfileSection = document.getElementById('userProfileSection');
        const authButtons = document.getElementById('authButtons');
        
        if (userProfileSection) {
            userProfileSection.style.display = 'flex';
            document.getElementById('welcomeUser').textContent = `Welcome, ${this.currentUser.name}!`;
            document.getElementById('userInitials').textContent = this.getInitials(this.currentUser.name);
        }
        
        if (authButtons) {
            authButtons.style.display = 'none';
        }

        // Update welcome message with personalized data
        this.updatePersonalizedWelcome();
    }

    // Update UI for logged out user
    updateUIForLoggedOutUser() {
        const userProfileSection = document.getElementById('userProfileSection');
        const authButtons = document.getElementById('authButtons');
        
        if (userProfileSection) {
            userProfileSection.style.display = 'none';
        }
        
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
    }

    // Get user initials
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    // Update personalized welcome message
    updatePersonalizedWelcome() {
        if (!this.currentUser) {
            // Show welcome message for non-logged in users
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.innerHTML = `
                    <h2>Welcome to SamCrypto AI! 🚀</h2>
                    <p>Your personal crypto trading assistant powered by advanced AI and real-time market data.</p>
                    <p>Create an account to unlock personalized trading recommendations! 💰</p>
                `;
            }
            return;
        }

        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            const daysSinceJoin = Math.floor((Date.now() - this.currentUser.stats.joinDate) / (1000 * 60 * 60 * 24));
            const portfolioValue = this.currentUser.portfolio.totalValue;
            
            // Different messages for new vs returning users
            if (daysSinceJoin === 0) {
                welcomeMessage.innerHTML = `
                    <h2>Welcome to SamCrypto AI, ${this.currentUser.name}! 🎉</h2>
                    <p>Your account has been created! Let's start building your crypto portfolio.</p>
                    <p>Ask me about any cryptocurrency to get personalized trading advice! 🚀</p>
                `;
            } else {
                welcomeMessage.innerHTML = `
                    <h2>Welcome back, ${this.currentUser.name}! 👋</h2>
                    <p>You've been with SamCrypto AI for ${daysSinceJoin} day${daysSinceJoin !== 1 ? 's' : ''}. Your portfolio is worth $${portfolioValue.toLocaleString()}.</p>
                    <p>Ready to make some profitable trades today? 🚀</p>
                `;
            }
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Login button
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            this.showLoginModal();
        });

        // Register button
        document.getElementById('registerBtn')?.addEventListener('click', () => {
            this.showRegisterModal();
        });

        // Modal close buttons
        document.getElementById('loginModalClose')?.addEventListener('click', () => {
            this.closeModal('loginModal');
        });

        document.getElementById('registerModalClose')?.addEventListener('click', () => {
            this.closeModal('registerModal');
        });

        document.getElementById('profileModalClose')?.addEventListener('click', () => {
            this.closeModal('profileModal');
        });

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate();
        });

        // Switch between login and register
        document.getElementById('switchToRegister')?.addEventListener('click', () => {
            this.closeModal('loginModal');
            this.showRegisterModal();
        });

        document.getElementById('switchToLogin')?.addEventListener('click', () => {
            this.closeModal('registerModal');
            this.showLoginModal();
        });

        // User menu
        document.getElementById('userMenuToggle')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserMenu();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('userDropdown');
            const userProfile = document.getElementById('userProfileSection');
            
            if (dropdown && userProfile && !userProfile.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        // Profile settings
        document.getElementById('profileSettings')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleUserMenu(); // Close dropdown
            this.showProfileModal();
        });

        // Data export
        document.getElementById('dataExport')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleUserMenu(); // Close dropdown
            this.exportUserData();
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleUserMenu(); // Close dropdown
            this.logout();
        });

        // Profile cancel
        document.getElementById('profileCancel')?.addEventListener('click', () => {
            this.closeModal('profileModal');
        });
    }

    // Handle login form submission
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        await this.login(email, password, rememberMe);
    }

    // Handle register form submission
    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        await this.register(name, email, password, confirmPassword);
    }

    // Handle profile update
    handleProfileUpdate() {
        const profileData = {
            name: document.getElementById('profileName').value,
            riskTolerance: document.getElementById('riskTolerance').value,
            tradingExperience: document.getElementById('tradingExperience').value,
            preferredCurrency: document.getElementById('preferredCurrency').value,
            apiKey: document.getElementById('profileApiKey').value
        };

        const result = this.updateProfile(profileData);
        if (result.success) {
            this.closeModal('profileModal');
        }
    }

    // Show modals
    showLoginModal() {
        document.getElementById('loginModal').classList.remove('hidden');
        document.getElementById('loginModal').style.display = 'flex';
    }

    showRegisterModal() {
        document.getElementById('registerModal').classList.remove('hidden');
        document.getElementById('registerModal').style.display = 'flex';
    }

    showProfileModal() {
        if (!this.currentUser) return;
        
        // Populate form with current data
        document.getElementById('profileName').value = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;
        document.getElementById('riskTolerance').value = this.currentUser.preferences.riskTolerance;
        document.getElementById('tradingExperience').value = this.currentUser.preferences.tradingExperience;
        document.getElementById('preferredCurrency').value = this.currentUser.preferences.preferredCurrency;
        document.getElementById('profileApiKey').value = this.currentUser.preferences.apiKey || '';
        
        document.getElementById('profileModal').classList.remove('hidden');
        document.getElementById('profileModal').style.display = 'flex';
    }

    // Close modals
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }

    closeModals() {
        this.closeModal('loginModal');
        this.closeModal('registerModal');
        this.closeModal('profileModal');
    }

    // Toggle user menu
    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    // Show messages
    showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.getElementById('authMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'authMessage';
            messageEl.className = 'auth-message';
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.display = 'none';
            }
        }, 5000);
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
}
