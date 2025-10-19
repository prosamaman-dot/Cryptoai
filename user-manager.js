// UserManager - Professional User Authentication & Data Management System
// Handles signup, signin, session management, and persistent user data storage

class UserManager {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'samcrypto_session';
        this.usersKey = 'samcrypto_users';
        
        // Load users first (like loading from database)
        this.users = this.loadUsers();
        console.log('📊 Loaded users database:', Object.keys(this.users).length, 'users');
        
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

    // Save users to localStorage (like SQL INSERT/UPDATE)
    saveUsers() {
        try {
            const usersJSON = JSON.stringify(this.users, null, 2);
            localStorage.setItem(this.usersKey, usersJSON);
            console.log('💾 Users database saved:', Object.keys(this.users).length, 'users');
            
            // Auto-backup to downloadable JSON every time we save
            this.autoBackupToJSON();
        } catch (error) {
            console.error('❌ Error saving users:', error);
        }
    }
    
    // Auto-backup users to data.json format (like SQL backup)
    autoBackupToJSON() {
        try {
            const backup = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                users: this.users,
                totalUsers: Object.keys(this.users).length
            };
            
            // Store backup in localStorage for recovery
            localStorage.setItem('samcrypto_backup', JSON.stringify(backup));
            console.log('📦 Auto-backup created');
        } catch (error) {
            console.error('❌ Backup failed:', error);
        }
    }
    
    // Export database to data.json file (like SQL dump)
    exportDatabase() {
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            users: this.users,
            totalUsers: Object.keys(this.users).length
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `samcrypto_database_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage('Database exported to data.json!', 'success');
        console.log('📥 Database exported');
    }
    
    // Import database from data.json file (like SQL restore)
    importDatabase(jsonData) {
        try {
            const backup = JSON.parse(jsonData);
            
            if (backup.users) {
                this.users = backup.users;
                this.saveUsers();
                this.showMessage(`Database imported! ${backup.totalUsers} users loaded.`, 'success');
                console.log('📤 Database imported:', backup.totalUsers, 'users');
                
                // Reload page to apply
                setTimeout(() => window.location.reload(), 1000);
                return true;
            } else {
                throw new Error('Invalid backup format');
            }
        } catch (error) {
            this.showMessage('Failed to import database: ' + error.message, 'error');
            console.error('❌ Import failed:', error);
            return false;
        }
    }

    // Initialize authentication on page load
    initializeAuth() {
        console.log('🔑 Initializing authentication...');
        
        // Step 1: Get session from localStorage
        const session = this.getSession();
        console.log('🔐 Session:', session ? `User: ${session.userId}` : 'No session');
        console.log('👥 Database has', Object.keys(this.users).length, 'users');
        
        // Step 2: Check if session exists and user exists in database
        if (session && session.userId) {
            const user = this.users[session.userId];
            
            if (user) {
                // Step 3: Check if session expired
                const isExpired = session.expiresAt && Date.now() > session.expiresAt;
                
                if (isExpired) {
                    console.log('⏰ Session expired, logging out');
                    this.clearSession();
                    this.currentUser = null;
                    this.updateUIForLoggedOutUser();
                } else {
                    // Step 4: Session valid, restore user
                    console.log('✅ Session valid! Logging in:', user.name);
                    this.currentUser = user;
                    
                    // Update last active time
                    this.currentUser.stats.lastActive = Date.now();
                    this.saveUsers();
                    
                    // Update UI to show logged in state
                    document.body.classList.add('logged-in');
                    this.updateUIForLoggedInUser();
                    
                    console.log('✅ User restored:', this.currentUser.name);
                }
            } else {
                console.log('❌ User not found in database for session:', session.userId);
                this.clearSession();
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
            }
        } else {
            console.log('❌ No session found');
            this.currentUser = null;
            this.updateUIForLoggedOutUser();
        }
        
        // Final UI sync
        setTimeout(() => {
            this.syncAuthUI();
            console.log('🎯 Auth initialized. Logged in:', !!this.currentUser);
        }, 100);
    }

    // Check if this is a first-time visitor and show signup
    checkForFirstTimeVisitor() {
        const hasVisited = localStorage.getItem('samcrypto_visited');
        
        // Just mark as visited, don't auto-show signup
        // Users can click Sign Up button when they're ready
        if (!hasVisited) {
            localStorage.setItem('samcrypto_visited', 'true');
            console.log('👋 First time visitor detected - Welcome!');
        }
        
        // Removed auto-popup - users should click Sign Up when ready
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
    setSession(userId, rememberMe = true) {
        const session = {
            userId: userId,
            loginTime: Date.now(),
            expiresAt: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (7 * 24 * 60 * 60 * 1000), // 30 days or 7 days
            rememberMe: rememberMe
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        console.log('💾 Session saved:', session);
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

            // Save user to database (like SQL INSERT)
            this.users[userId] = newUser;
            this.saveUsers(); // Saves to localStorage + auto-backup
            console.log('✅ User registered:', newUser.email);
            console.log('📊 Total users in database:', Object.keys(this.users).length);

            // Auto-login after registration
            this.currentUser = newUser;
            this.setSession(userId, true); // Remember me by default (30 days)
            
            // Double-save for safety
            this.saveUsers();
            
            // Update UI immediately
            document.body.classList.add('logged-in');
            this.updateUIForLoggedInUser();

            this.showMessage(`🎉 Account created! Welcome ${newUser.name}! You are now logged in.`, 'success');
            this.closeModals();
            
            console.log('✅ Registration complete. User logged in:', this.currentUser.name);

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

            // Update last login in database (like SQL UPDATE)
            user.lastLogin = Date.now();
            user.stats.lastActive = Date.now();
            this.users[user.id] = user; // Update in database
            this.saveUsers(); // Save to localStorage + backup
            console.log('✅ User logged in:', user.email);

            // Set current user and session
            this.currentUser = user;
            this.setSession(user.id, rememberMe);
            
            // Double-save for persistence
            this.saveUsers();
            
            // Update UI immediately
            document.body.classList.add('logged-in');
            this.updateUIForLoggedInUser();

            this.showMessage(`🎉 Welcome back, ${user.name}! You are logged in.`, 'success');
            this.closeModals();
            
            console.log('✅ Login complete. User:', this.currentUser.name);

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

    // Save user preferences
    saveUserPreferences(preferences) {
        if (!this.currentUser) return;
        
        this.currentUser.preferences = {
            ...this.currentUser.preferences,
            ...preferences
        };
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

        this.showMessage('Data exported successfully! 📥', 'success');
    }

    // Import user data
    importUserData() {
        if (!this.currentUser) {
            this.showMessage('Please login first', 'error');
            return;
        }

        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const importData = JSON.parse(event.target.result);
                    
                    // Validate data structure
                    if (!importData.user || !importData.version) {
                        throw new Error('Invalid data format');
                    }

                    // Confirm import
                    const confirmMsg = `Import data from ${importData.exportDate ? new Date(importData.exportDate).toLocaleDateString() : 'unknown date'}?\n\n` +
                        `This will replace your current data:\n` +
                        `- Portfolio: ${importData.user.portfolio?.holdings?.length || 0} holdings\n` +
                        `- USDT Balance: $${(importData.user.portfolio?.usdtBalance || 0).toFixed(2)}\n` +
                        `- Alerts: ${importData.user.alerts?.length || 0} active\n` +
                        `- Conversations: ${importData.user.conversationHistory?.length || 0} saved\n\n` +
                        `Current data will be backed up first.`;

                    if (!confirm(confirmMsg)) {
                        this.showMessage('Import cancelled', 'info');
                        return;
                    }

                    // Backup current data first
                    const backupData = {
                        user: this.currentUser,
                        backupDate: new Date().toISOString(),
                        version: '1.0'
                    };
                    localStorage.setItem(`samcrypto_backup_${this.currentUser.email}`, JSON.stringify(backupData));

                    // Import data (keep current email and password)
                    const currentEmail = this.currentUser.email;
                    const currentPassword = this.currentUser.password;
                    
                    this.currentUser = {
                        ...importData.user,
                        email: currentEmail,  // Keep current email
                        password: currentPassword,  // Keep current password
                        lastLogin: new Date().toISOString()
                    };

                    // Save to localStorage
                    this.saveUser(this.currentUser);

                    // Reload app with imported data
                    if (window.samCrypto) {
                        window.samCrypto.loadUserData();
                    }

                    this.showMessage('Data imported successfully! 📤\n\nYour previous data was backed up.', 'success');
                    
                    // Reload page to apply all changes
                    setTimeout(() => {
                        location.reload();
                    }, 2000);

                } catch (error) {
                    console.error('Import error:', error);
                    this.showMessage('Failed to import data. Please check the file format.', 'error');
                }
            };

            reader.onerror = () => {
                this.showMessage('Failed to read file', 'error');
            };

            reader.readAsText(file);
        });

        // Trigger file selection
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    // Update UI for logged in user
    updateUIForLoggedInUser() {
        if (!this.currentUser) return;

        // Hide auth buttons, show logout in features page
        const authButtons = document.getElementById('authButtons');
        const logoutCard = document.getElementById('openLogout');
        
        if (authButtons) {
            authButtons.style.display = 'none';
        }
        
        if (logoutCard) {
            logoutCard.style.display = 'block';
        }

        // Update welcome message with personalized data
        this.updatePersonalizedWelcome();
        
        // Reload main app with user data
        if (window.samCrypto) {
            console.log('🔄 Reloading main app with user data...');
            window.samCrypto.loadUserData();
        }
        
        // Add body class for CSS-based control
        document.body.classList.add('logged-in');
        console.log('✅ UI updated for logged in user:', this.currentUser.name);
    }

    // Update UI for logged out user
    updateUIForLoggedOutUser() {
        const authButtons = document.getElementById('authButtons');
        const logoutCard = document.getElementById('openLogout');
        
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
        
        if (logoutCard) {
            logoutCard.style.display = 'none';
        }
        
        document.body.classList.remove('logged-in');
        console.log('✅ UI updated for logged out user');
    }

    // Ensure header UI matches auth state (extra safety for refresh/load)
    syncAuthUI() {
        const authButtons = document.getElementById('authButtons');
        const logoutCard = document.getElementById('openLogout');
        
        if (this.currentUser) {
            // Logged in: hide auth buttons, show logout
            if (authButtons) authButtons.style.display = 'none';
            if (logoutCard) logoutCard.style.display = 'block';
        } else {
            // Logged out: show auth buttons, hide logout
            if (authButtons) authButtons.style.display = 'flex';
            if (logoutCard) logoutCard.style.display = 'none';
        }
    }

    // Get user initials
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    // Update personalized welcome message
    updatePersonalizedWelcome() {
        // Keep the simple "What can I help with?" message
        // No need to change it based on login state
        // This keeps it clean like ChatGPT mobile
        console.log('✅ Keeping simple welcome message');
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
            e.preventDefault(); // Prevent default link behavior
            e.stopPropagation(); // Stop event bubbling
            console.log('🔽 User menu toggle clicked');
            this.toggleUserMenu();
        });
        
        // Also make the avatar clickable
        document.getElementById('userAvatar')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔽 User avatar clicked');
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
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            console.log('✅ Login modal opened');
        } else {
            console.error('❌ Login modal not found!');
        }
    }

    showRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            console.log('✅ Register modal opened');
        } else {
            console.error('❌ Register modal not found!');
        }
    }

    showProfileModal() {
        if (!this.currentUser) return;
        
        // Populate form with current data
        document.getElementById('profileName').value = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;
        document.getElementById('riskTolerance').value = this.currentUser.preferences.riskTolerance;
        document.getElementById('tradingExperience').value = this.currentUser.preferences.tradingExperience;
        document.getElementById('preferredCurrency').value = this.currentUser.preferences.preferredCurrency;
        
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            console.log('✅ Modal closed:', modalId);
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
        const userProfileSection = document.getElementById('userProfileSection');
        
        console.log('🛠️ toggleUserMenu called');
        console.log('Dropdown element:', dropdown);
        console.log('Current display:', dropdown ? dropdown.style.display : 'not found');
        
        if (!dropdown) {
            console.error('❌ userDropdown element not found!');
            return;
        }
        
        const isCurrentlyVisible = dropdown.style.display === 'block';
        
        if (isCurrentlyVisible) {
            // Close dropdown
            dropdown.style.display = 'none';
            console.log('❌ Dropdown closed');
        } else {
            // Open dropdown and position it
            dropdown.style.display = 'block';
            
            // Position dropdown below user profile section using fixed positioning
            if (userProfileSection) {
                const rect = userProfileSection.getBoundingClientRect();
                const top = rect.bottom + 5; // 5px below user section
                const right = window.innerWidth - rect.right;
                
                dropdown.style.top = top + 'px';
                dropdown.style.right = right + 'px';
                
                console.log('✅ Dropdown opened at position:', { top, right });
            } else {
                // Fallback positioning
                dropdown.style.top = '60px';
                dropdown.style.right = '10px';
                console.log('⚠️ Using fallback positioning');
            }
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
        messageEl.style.opacity = '1';
        messageEl.style.visibility = 'visible';
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.zIndex = '999999';
        messageEl.style.padding = '15px 25px';
        messageEl.style.borderRadius = '8px';
        messageEl.style.fontWeight = '500';
        messageEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        
        // Color based on type
        if (type === 'error') {
            messageEl.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            messageEl.style.color = '#ffffff';
        } else if (type === 'success') {
            messageEl.style.background = 'linear-gradient(135deg, #00c851, #007e33)';
            messageEl.style.color = '#ffffff';
        } else {
            messageEl.style.background = 'linear-gradient(135deg, #33b5e5, #0099cc)';
            messageEl.style.color = '#ffffff';
        }

        console.log(`📢 Message displayed: [${type.toUpperCase()}] ${message}`);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.opacity = '0';
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 300);
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
